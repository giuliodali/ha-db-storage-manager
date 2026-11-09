"""WebSocket API used by the panel. All commands are admin-only."""

from __future__ import annotations

import asyncio
import re
import time
from pathlib import Path
from typing import Any, Callable

import voluptuous as vol
from sqlalchemy import text

from homeassistant.components import websocket_api
from homeassistant.components.recorder import get_instance
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.util import slugify
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.recorder import session_scope

from .const import DOMAIN, SNAPSHOT_DIR, VERSION
from . import inventory_store
from . import actions, automation_sync, retention
from .candidates import classify
from .estimates import apply_window, entity_estimates, window_activity, partial_estimates
from .usage import CAVEATS, Matcher, merge_locations
from .usage_sources import collect_usage
from .facets import apply_filters, age_bucket, build_facets
from .queries import entity_rows, statistics_counts, table_sizes
from .recorder_ops import _make_snapshot, _read, _safe, _snapshot_dir, clear_statistics
from .snapshot import export_statistics, read_snapshot, write_snapshot
from .tasks import RestoreStatisticsTask


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    for handler in (
        ws_ping,
        ws_scan,
        ws_stats_info,
        ws_snapshot,
        ws_delete_statistics,
        ws_restore_statistics,
        ws_list_snapshots,
        ws_set_entity_disabled,
        ws_entities,
        ws_size_history,
        ws_sample_now,
        ws_scan_status,
        ws_db_size,
        ws_entity_rows,
        ws_preview_action,
        ws_apply_action,
        ws_undo_action,
        ws_action_status,
        ws_actions,
        ws_backup_usage,
        ws_retention_status,
        ws_retention_run,
        ws_delete_actions,
        ws_reclaim,
        ws_usage,
    ):
        websocket_api.async_register_command(hass, handler)


@websocket_api.websocket_command({vol.Required("type"): "db_storage/ping"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_ping(hass, connection, msg) -> None:
    instance = get_instance(hass)
    connection.send_result(
        msg["id"],
        {
            "integration_version": VERSION,
            "ha_version": HA_VERSION,
            "db_url_scheme": str(instance.db_url).split(":", 1)[0],
            "recorder_running": instance.is_running if hasattr(instance, "is_running") else None,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "db_storage/scan"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_scan(hass, connection, msg) -> None:
    started = time.monotonic()
    result = await _read(hass, table_sizes)
    result["total_ms"] = round((time.monotonic() - started) * 1000, 1)
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/stats_info", vol.Required("statistic_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_stats_info(hass, connection, msg) -> None:
    sid = msg["statistic_id"]
    connection.send_result(msg["id"], await _read(hass, lambda s: statistics_counts(s, sid)))


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/snapshot_statistics", vol.Required("statistic_id"): str}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_snapshot(hass, connection, msg) -> None:
    result = await _make_snapshot(hass, msg["statistic_id"])
    if result is None:
        connection.send_error(msg["id"], "not_found", "No such statistic")
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "db_storage/delete_statistics",
        vol.Required("statistic_id"): str,
        vol.Optional("confirm", default=False): bool,
        vol.Optional("snapshot_first", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_statistics(hass, connection, msg) -> None:
    sid = msg["statistic_id"]
    instance = get_instance(hass)
    before = await _read(hass, lambda s: statistics_counts(s, sid))
    if not before["exists"]:
        connection.send_error(msg["id"], "not_found", "No such statistic")
        return
    if not msg["confirm"]:
        connection.send_result(msg["id"], {"dry_run": True, "before": before})
        return

    snap = None
    if msg["snapshot_first"]:
        snap = await _make_snapshot(hass, sid)

    try:
        await clear_statistics(hass, [sid])
    except TimeoutError:
        connection.send_error(msg["id"], "timeout", "Recorder did not finish the delete in time")
        return
    except RuntimeError as err:
        connection.send_error(msg["id"], "unsupported", str(err))
        return
    after = await _read(hass, lambda s: statistics_counts(s, sid))
    connection.send_result(
        msg["id"], {"dry_run": False, "before": before, "after": after, "snapshot": snap}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "db_storage/restore_statistics",
        vol.Required("snapshot"): str,
        vol.Optional("merge", default=True): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_restore_statistics(hass, connection, msg) -> None:
    name = msg["snapshot"]
    if name != _safe(name) or "/" in name:
        connection.send_error(msg["id"], "invalid", "Bad snapshot name")
        return
    path = _snapshot_dir(hass) / name
    if not path.is_file():
        connection.send_error(msg["id"], "not_found", "Snapshot not found")
        return
    data = await hass.async_add_executor_job(read_snapshot, path)
    loop = asyncio.get_running_loop()
    future: asyncio.Future = loop.create_future()
    get_instance(hass).queue_task(RestoreStatisticsTask(data=data, future=future, loop=loop, merge=msg["merge"]))
    try:
        result = await asyncio.wait_for(future, timeout=120)
    except ValueError as err:
        connection.send_error(msg["id"], "refused", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "db_storage/list_snapshots"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_snapshots(hass, connection, msg) -> None:
    def listing() -> list[dict[str, Any]]:
        d = _snapshot_dir(hass)
        if not d.is_dir():
            return []
        return [
            {"snapshot": p.name, "bytes": p.stat().st_size, "modified": p.stat().st_mtime}
            for p in sorted(d.glob("*.json.gz"), key=lambda p: p.stat().st_mtime, reverse=True)
        ]

    connection.send_result(msg["id"], await hass.async_add_executor_job(listing))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "db_storage/set_entity_disabled",
        vol.Required("entity_id"): str,
        vol.Required("disabled"): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_entity_disabled(hass, connection, msg) -> None:
    registry = er.async_get(hass)
    entry = registry.async_get(msg["entity_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Entity is not in the registry")
        return
    previous = entry.disabled_by.value if entry.disabled_by else None
    new = er.RegistryEntryDisabler.USER if msg["disabled"] else None
    registry.async_update_entity(msg["entity_id"], disabled_by=new)
    connection.send_result(
        msg["id"],
        {
            "entity_id": msg["entity_id"],
            "previous_disabled_by": previous,
            "disabled_by": new.value if new else None,
        },
    )


# --- M1: inventory, facets and size history ---------------------------------

def _friendly_name(hass: HomeAssistant, ent_reg: er.EntityRegistry, eid: str) -> str:
    """Name as Home Assistant shows it: live state first, then the registry, then the id."""
    if (st := hass.states.get(eid)) is not None:
        return st.name
    if (reg := ent_reg.async_get(eid)) is not None:
        return reg.name or reg.original_name or eid
    return eid


def _enrich(hass: HomeAssistant, entities: dict[str, dict[str, Any]], now: float) -> list[dict[str, Any]]:
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    items: list[dict[str, Any]] = []
    for eid, m in entities.items():
        external = ":" in eid or "." not in eid
        reg = None if external else ent_reg.async_get(eid)
        device = "No device"
        if reg and reg.device_id and (dev := dev_reg.async_get(reg.device_id)):
            device = dev.name_by_user or dev.name or "No device"
        if external:
            status, integration, domain = "External", eid.split(":", 1)[0] or "external", "external"
        else:
            domain = eid.split(".", 1)[0]
            integration = reg.platform if reg else "unknown"
            if reg:
                status = "Disabled" if reg.disabled_by else "Active"
            else:
                status = "Active" if hass.states.get(eid) is not None else "Orphaned"
        live = None if external else hass.states.get(eid)
        items.append(
            {
                "entity_id": eid,
                "unavailable": bool(live is not None and live.state == "unavailable"),
                "provider_gone": bool(live is not None and live.attributes.get("restored")),
                "integration": integration,
                "device": device,
                "domain": domain,
                "status": status,
                "age": age_bucket(m["last_ts"], now),
                "last_ts": m["last_ts"],
                "states_rows": m["states_rows"],
                "stats_rows": m["stats_rows"],
                "short_rows": m["short_rows"],
                "states_w": m["states_w"],
                "attrs_w": m["attrs_w"],
                "states_bytes": round(m["states_bytes"]),
                "attrs_bytes": round(m["attrs_bytes"]),
                "stats_bytes": round(m["stats_bytes"]),
                "total_bytes": round(m["total_bytes"]),
            }
        )
    return items


# Helpers you create in the UI: storage-based domains, and config-entry helpers (template, threshold, ...).
_HELPER_PLATFORMS = {"input_boolean", "input_number", "input_select", "input_text", "input_datetime", "input_button",
                     "counter", "timer", "schedule", "person", "zone", "tag"}
_HELPER_ENTRY_DOMAINS = {"group", "template", "threshold", "derivative", "integration", "min_max", "statistics", "utility_meter",
                         "history_stats", "trend", "switch_as_x", "generic_hygrostat", "generic_thermostat", "random", "filter",
                         "tod", "mold_indicator", "compensation", "bayesian", "ping_helper"}


def _defined_in(hass: HomeAssistant, reg: er.RegistryEntry) -> str:
    if reg.config_entry_id:
        entry = hass.config_entries.async_get_entry(reg.config_entry_id)
        return "Helper" if entry is not None and entry.domain in _HELPER_ENTRY_DOMAINS else "Integration"
    return "Helper" if reg.platform in _HELPER_PLATFORMS else "YAML"


def _live_flags(hass: HomeAssistant, ent_reg: er.EntityRegistry, it: dict[str, Any]) -> None:
    """Fields that depend on the live state and registry, refreshed on every request."""
    eid = it["entity_id"]
    days = retention.rules(hass).get(eid)
    it["retention_days"] = days
    it["retention"] = (f"{days} day" + ("" if days == 1 else "s")) if days else "Default"
    if it["status"] == "External":
        it.update(unavailable=False, provider_gone=False, defined_in="External statistics")
        return
    live = hass.states.get(eid)
    reg = ent_reg.async_get(eid)
    it["status"] = ("Disabled" if reg.disabled_by else "Active") if reg else ("Active" if live is not None else "Orphaned")
    it["unavailable"] = bool(live is not None and live.state == "unavailable")
    it["provider_gone"] = bool(live is not None and live.attributes.get("restored"))
    if reg is not None:
        it["defined_in"] = _defined_in(hass, reg)
    else:
        it["defined_in"] = "YAML (no unique ID)" if live is not None else "None (history only)"


STEPS = [
    ("tables", "Measuring table sizes"),
    ("states", "Sizing state history"),
    ("attributes", "Sizing attributes"),
    ("statistics", "Sizing long-term statistics"),
    ("config", "Scanning automations, dashboards and helpers"),
    ("finish", "Saving results"),
]


def _new_progress() -> dict[str, Any]:
    return {
        "running": True, "started": time.time(), "error": None,
        "steps": [{"key": k, "label": lbl, "status": "pending", "ms": None, "_t": None} for k, lbl in STEPS],
    }


def _step(progress: dict[str, Any], key: str, status: str) -> None:
    for st in progress["steps"]:
        if st["key"] == key:
            if status == "running":
                st["_t"] = time.monotonic()
            elif st["_t"] is not None:
                st["ms"] = round((time.monotonic() - st["_t"]) * 1000)
            st["status"] = status


def _public_progress(progress: dict[str, Any] | None) -> dict[str, Any]:
    if not progress:
        return {"running": False, "steps": [], "error": None, "elapsed_s": 0}
    steps = []
    for st in progress["steps"]:
        ms = st["ms"]
        if st["status"] == "running" and st["_t"] is not None:
            ms = round((time.monotonic() - st["_t"]) * 1000)
        steps.append({"key": st["key"], "label": st["label"], "status": st["status"], "ms": ms})
    return {"running": progress["running"], "error": progress["error"], "steps": steps,
            "elapsed_s": round(time.time() - progress["started"], 1)}


async def _do_scan(hass: HomeAssistant, progress: dict[str, Any], full: bool = True) -> dict[str, Any]:
    state = hass.data[DOMAIN]
    inv = state.get("inventory")
    previous = None if full or not inv else {i["entity_id"]: i for i in inv["items"]}
    targets = {e for e, i in (previous or {}).items() if i.get("size_stale")}
    started = time.monotonic()
    prev = {"key": None}

    def mark(key: str) -> None:  # called from the recorder thread
        if prev["key"]:
            _step(progress, prev["key"], "done")
        prev["key"] = key
        _step(progress, key, "running")

    def run(session: Any) -> tuple[dict[str, Any], dict[str, Any]]:
        mark("tables")
        scan = table_sizes(session)
        tb = {t["table"]: t["bytes"] or 0 for t in scan["tables"]}
        est = partial_estimates(session, tb, previous, targets, progress=mark) if previous is not None else None
        if est is None:  # a full scan, or the last one is too old to refresh in part
            est = entity_estimates(session, tb, progress=mark)
        _step(progress, prev["key"], "done")
        return scan, est

    # Config scan needs the entity list, so it starts after the database part has the ids.
    scan, est = await _read(hass, run)
    now = time.time()
    items = _enrich(hass, est["entities"], now)

    _step(progress, "config", "running")
    t_usage = time.monotonic()
    ent_reg = er.async_get(hass)
    registry_ids = {
        reg.id: eid for eid in (i["entity_id"] for i in items)
        if (reg := ent_reg.async_get(eid)) is not None
    }
    unique_ids: dict[str, str] = {}
    slugs: dict[str, list[str]] = {}
    for i in items:  # entities defined in YAML: no config entry behind them
        eid = i["entity_id"]
        reg = ent_reg.async_get(eid)
        if i["status"] != "External" and (reg is None and hass.states.get(eid) is not None or reg is not None and not reg.config_entry_id):
            if reg is not None and reg.unique_id:
                unique_ids[str(reg.unique_id)] = eid
            slugs.setdefault(eid.split(".", 1)[1], []).append(eid)
    matcher = Matcher({i["entity_id"] for i in items}, registry_ids, unique_ids, slugs, slugify)
    own = {e.entry_id for e in hass.config_entries.async_entries(DOMAIN)}
    usage = await collect_usage(hass, matcher, own)
    for it in items:
        it.update(usage.summary(it["entity_id"], it["domain"]))
        it.update(classify(it))
    usage_ms = round((time.monotonic() - t_usage) * 1000, 1)
    _step(progress, "config", "done")

    _step(progress, "finish", "running")
    cache = {
        "ts": now, "scan": scan, "usage": usage,
        "timings_ms": {**est["timings_ms"], "usage_ms": usage_ms,
                       "total_ms": round((time.monotonic() - started) * 1000, 1)},
        "items": items,
        "partial": {"refreshed": est["refreshed"], "new": est["new"]} if "refreshed" in est else None,
    }
    state["inventory"] = cache
    try:
        await hass.async_add_executor_job(inventory_store.save, _inventory_path(hass), cache)
    except Exception:  # noqa: BLE001 - persisting is best effort
        pass
    _step(progress, "finish", "done")
    return cache


def _inventory_path(hass: HomeAssistant) -> Path:
    return Path(hass.config.path("db_storage_manager", "inventory.json.gz"))


async def async_load_inventory(hass: HomeAssistant) -> None:
    """Restore the last scan from disk so the panel opens instantly after a restart."""
    path = _inventory_path(hass)
    cache = await hass.async_add_executor_job(inventory_store.load, path)
    if cache:
        hass.data[DOMAIN].setdefault("inventory", cache)
    elif await hass.async_add_executor_job(path.exists):
        hass.data[DOMAIN]["rescan_needed"] = True  # saved by an older version: redo it once Home Assistant has started


async def _extra_sample(hass: HomeAssistant) -> None:
    """Record a size point outside the schedule (after a scan, an action or deleting records)."""
    try:
        await hass.data[DOMAIN]["sampler"].async_sample()
    except Exception:  # noqa: BLE001 - never let a chart point break the real work
        pass


def start_scan(hass: HomeAssistant) -> asyncio.Task:
    """Start a full scan unless one is running (single flight) and return its task."""
    state = hass.data[DOMAIN]
    task = state.get("scan_task")
    if task and not task.done():
        return task
    progress = _new_progress()
    state["progress"] = progress

    async def runner() -> dict[str, Any]:
        try:
            result = await _do_scan(hass, progress)
            await _extra_sample(hass)  # a Re-Scan also adds a point to the size chart
            return result
        except Exception as err:  # noqa: BLE001
            progress["error"] = f"{type(err).__name__}: {err}"
            raise
        finally:
            progress["running"] = False

    state["scan_task"] = task = hass.async_create_background_task(runner(), "db_storage_scan")
    return task


async def _inventory(hass: HomeAssistant, refresh: bool) -> dict[str, Any]:
    """Blocking variant (used by tests and ``wait``): returns the cache or runs a scan."""
    cache = hass.data[DOMAIN].get("inventory")
    if cache and not refresh:
        return cache
    return await start_scan(hass)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "db_storage/entities",
        vol.Optional("filters", default={}): {str: [str]},
        vol.Optional("search", default=""): str,
        vol.Optional("limit", default=500): vol.All(int, vol.Range(min=1, max=5000)),
        vol.Optional("refresh", default=False): bool,
        vol.Optional("wait", default=False): bool,
        vol.Optional("expand", default=[]): [str],
        vol.Optional("exclude_domains", default=[]): [str],
        # Optional period (unix seconds): only entities that wrote data inside it.
        vol.Optional("window"): vol.All([vol.Coerce(float)], vol.Length(min=2, max=2)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_entities(hass, connection, msg) -> None:
    state = hass.data[DOMAIN]
    if msg["wait"]:
        inv = await _inventory(hass, msg["refresh"])
    else:
        inv = state.get("inventory")
        if msg["refresh"] or inv is None:
            start_scan(hass)  # returns at once; the panel polls scan_status
        if inv is None:
            connection.send_result(msg["id"], {"no_data": True, "scanning": True})
            return
    ent_reg = er.async_get(hass)
    for it in inv["items"]:
        eid = it["entity_id"]
        it["name"] = _friendly_name(hass, ent_reg, eid)  # names change, so never cached
        _live_flags(hass, ent_reg, it)  # what Home Assistant says right now, so no re-scan is needed
        it.update(classify(it))
    base, size_key, window = inv["items"], "total_bytes", None
    if msg["exclude_domains"]:
        base = [i for i in base if i["domain"] not in msg["exclude_domains"]]
    if msg.get("window"):
        start, end = msg["window"]
        if end <= start:
            connection.send_error(msg["id"], "invalid_window", "The period must end after it starts")
            return
        key = (round(start), round(end))
        cached = state.get("window_cache")
        if cached and cached["key"] == key:
            act = cached["act"]
        else:
            act = await _read(hass, lambda session: window_activity(session, start, end))
            state["window_cache"] = {"key": key, "act": act}
        base = apply_window(base, act["rows"])
        size_key = "win_bytes"
        window = {"from": start, "to": end, "ms": act["ms"], "keep_days": get_instance(hass).keep_days}
    matches = apply_filters(base, msg["filters"], msg["search"], size_key)
    connection.send_result(
        msg["id"],
        {
            "generated": inv["ts"],
            "scan_age_s": round(time.time() - inv["ts"]),
            "stale": bool(inv.get("stale")),
            "stale_count": sum(1 for i in inv["items"] if i.get("size_stale")),
            "partial": inv.get("partial"),
            "scanning": bool(state.get("progress") and state["progress"]["running"]),
            "from_disk": bool(inv.get("from_disk")),
            "timings_ms": inv["timings_ms"],
            "tables": inv["scan"]["tables"],
            "usage_sources": inv["usage"].sources_scanned,
            "dynamic_sources": inv["usage"].dynamic_sources[:50],
            "caveats": CAVEATS,
            "total_bytes": inv["scan"].get("total_bytes"),
            "match_count": len(matches),
            "match_bytes": sum(i[size_key] for i in matches),
            "items": matches[: msg["limit"]],
            "facets": build_facets(base, msg["filters"], size_key=size_key, expand=msg["expand"]),
            "window": window,
        },
    )


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/size_history", vol.Optional("days", default=30): int}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_size_history(hass, connection, msg) -> None:
    journal = hass.data[DOMAIN]["journal"]
    since = time.time() - msg["days"] * 86400
    connection.send_result(msg["id"], await hass.async_add_executor_job(journal.size_history, since, 20000))


@websocket_api.websocket_command({vol.Required("type"): "db_storage/scan_status"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_scan_status(hass, connection, msg) -> None:
    connection.send_result(msg["id"], _public_progress(hass.data[DOMAIN].get("progress")))


# --- M4: actions with a journal, and undo -------------------------------------

def _public_job(job: dict[str, Any] | None) -> dict[str, Any]:
    if not job:
        return {"running": False}
    return {k: v for k, v in job.items() if not k.startswith("_")} | {
        "elapsed_s": round(time.time() - job["_started"], 1) if job.get("_started") else 0}


def _patch_inventory(hass: HomeAssistant, ids: list[str], kind: str | None, states: bool, stale: bool) -> None:
    """Show the effect of an action at once, without a scan.

    Status and retention are read live on every request. Here the sizes of the touched entities are
    zeroed for what was cleared and marked stale (shown with a refresh icon) until the next Re-Scan.
    """
    inv = hass.data[DOMAIN].get("inventory")
    if not inv:
        return
    wanted = set(ids)
    clear_stats = kind in ("delete_history", "disable_and_clear")
    clear_states = clear_stats and states
    for it in inv["items"]:
        if it["entity_id"] not in wanted:
            continue
        if clear_stats:
            it.update(stats_rows=0, short_rows=0, stats_bytes=0)
        if clear_states:
            it.update(states_rows=0, states_w=0.0, states_bytes=0, attrs_w=0.0, attrs_bytes=0)
        it["total_bytes"] = it["states_bytes"] + it["attrs_bytes"] + it["stats_bytes"]
        if stale:
            it["size_stale"] = True


async def _refresh_affected(hass: HomeAssistant) -> None:
    """Re-read only the entities an action changed (plus anything new), inside the action's own progress card."""
    task = hass.data[DOMAIN].get("scan_task")
    if task and not task.done():
        return  # a full scan is already running and will pick them up
    try:
        await _do_scan(hass, _new_progress(), full=False)
    except Exception:  # noqa: BLE001 - the entities keep their ⟳ until the next Re-Scan
        pass


def _start_job(hass: HomeAssistant, label: str, work: Callable[[dict[str, Any]], Any],
               affected: tuple[list[str], str | None, bool, bool] | None = None) -> bool:
    """Run one action or undo at a time in the background; poll it with action_status."""
    state = hass.data[DOMAIN]
    current = state.get("job")
    if current and current["running"]:
        return False
    job: dict[str, Any] = {"running": True, "label": label, "phase": "Starting", "done": 0, "total": 0,
                           "action_id": None, "error": None, "result": None, "_started": time.time()}
    state["job"] = job

    async def runner() -> None:
        try:
            job["result"] = await work(job)
            job["done"] = job["total"]
            if affected:
                _patch_inventory(hass, *affected)  # visible at once, then re-read just these entities below
                if affected[3]:
                    job["phase"] = "Refreshing sizes"
                    await _refresh_affected(hass)
        except Exception as err:  # noqa: BLE001
            job["error"] = f"{type(err).__name__}: {err}"
        finally:
            job["running"] = False
            job["phase"] = "Finished"
            await _extra_sample(hass)  # shows the backup space the action just used

    hass.async_create_background_task(runner(), "db_storage_action")
    return True


_KIND = vol.In(list(actions.KINDS))
_IDS = vol.All([str], vol.Length(min=1, max=actions.MAX_ENTITIES))


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/preview_action", vol.Required("kind"): _KIND,
     vol.Required("entity_ids"): _IDS, vol.Optional("states", default=True): bool,
     vol.Optional("keep_days"): vol.All(int, vol.Range(min=1, max=retention.MAX_DAYS)), vol.Optional("apply_now", default=True): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_preview_action(hass, connection, msg) -> None:
    kind = msg["kind"]
    if kind in actions.RETENTION_KINDS:
        if kind == "reduce_retention" and not msg.get("keep_days"):
            connection.send_error(msg["id"], "invalid_format", "keep_days is required")
            return
        connection.send_result(msg["id"], await actions.preview_retention(hass, kind, msg["entity_ids"], msg.get("keep_days"), msg["apply_now"]))
        return
    connection.send_result(msg["id"], actions.preview(hass, kind, msg["entity_ids"], msg["states"]))


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/apply_action", vol.Required("kind"): _KIND,
     vol.Required("entity_ids"): _IDS, vol.Required("confirm"): bool, vol.Optional("states", default=True): bool,
     vol.Optional("resync", default=False): bool,  # accepted for older panels; sizes are always refreshed now
     vol.Optional("keep_days"): vol.All(int, vol.Range(min=1, max=retention.MAX_DAYS)), vol.Optional("apply_now", default=True): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_apply_action(hass, connection, msg) -> None:
    if not msg["confirm"]:
        connection.send_error(msg["id"], "confirm_required", "Set confirm to true to run this action")
        return
    ids, kind, states = list(dict.fromkeys(msg["entity_ids"])), msg["kind"], msg["states"]
    if kind in actions.RETENTION_KINDS:
        if kind == "reduce_retention" and not msg.get("keep_days"):
            connection.send_error(msg["id"], "invalid_format", "keep_days is required")
            return
        work = lambda job: actions.run_retention_action(hass, kind, ids, msg.get("keep_days"), msg["apply_now"], job)  # noqa: E731
    else:
        work = lambda job: actions.run_action(hass, kind, ids, states, job)  # noqa: E731
    stale = kind not in ("disable",) and not (kind in actions.RETENTION_KINDS and not (kind == "reduce_retention" and msg["apply_now"]))
    started = _start_job(hass, actions.KINDS[kind], work, affected=(ids, kind, states, stale))
    if not started:
        connection.send_error(msg["id"], "busy", "Another action is still running")
        return
    connection.send_result(msg["id"], {"started": True})


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/undo_action", vol.Required("action_id"): int, vol.Required("confirm"): bool,
     vol.Optional("resync", default=False): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_undo_action(hass, connection, msg) -> None:
    if not msg["confirm"]:
        connection.send_error(msg["id"], "confirm_required", "Set confirm to true to undo")
        return
    action = await hass.async_add_executor_job(hass.data[DOMAIN]["journal"].get_action, msg["action_id"])
    if action is None or action["status"] in ("undone", "running"):
        connection.send_error(msg["id"], "cannot_undo", "This action does not exist or cannot be undone")
        return
    aid = msg["action_id"]
    undone = [e["entity_id"] for e in action.get("entities", []) if e.get("entity_id")]
    if not _start_job(hass, "Undo", lambda job: actions.run_undo(hass, aid, job),
                      affected=(undone, None, False, True)):
        connection.send_error(msg["id"], "busy", "Another action is still running")
        return
    connection.send_result(msg["id"], {"started": True})


@websocket_api.websocket_command({vol.Required("type"): "db_storage/action_status"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_action_status(hass, connection, msg) -> None:
    connection.send_result(msg["id"], _public_job(hass.data[DOMAIN].get("job")))


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/actions", vol.Optional("limit", default=100): vol.All(int, vol.Range(min=1, max=500))}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_actions(hass, connection, msg) -> None:
    rows = await hass.async_add_executor_job(hass.data[DOMAIN]["journal"].list_actions, msg["limit"])
    await hass.async_add_executor_job(actions.add_backup_info, hass, rows)
    connection.send_result(msg["id"], rows)


@websocket_api.websocket_command({vol.Required("type"): "db_storage/retention_status"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_retention_status(hass, connection, msg) -> None:
    connection.send_result(msg["id"], {**retention.status(hass), "next_run": retention.next_run_ts(hass),
                                       "automation": automation_sync.info(hass), "mode": hass.data[DOMAIN].get("retention_mode")})


@websocket_api.websocket_command({vol.Required("type"): "db_storage/retention_run", vol.Required("confirm"): bool})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_retention_run(hass, connection, msg) -> None:
    """Apply all rules now (what the nightly job does)."""
    if not msg["confirm"]:
        connection.send_error(msg["id"], "confirm_required", "Set confirm to true")
        return
    res = await automation_sync.async_run_now(hass)
    connection.send_result(msg["id"], {**(res["last_run"] or {}), "via": res["via"], "entity_id": res["entity_id"]})


@websocket_api.websocket_command({vol.Required("type"): "db_storage/backup_usage"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_backup_usage(hass, connection, msg) -> None:
    """Where the undo data lives and how much room it takes."""
    connection.send_result(msg["id"], await hass.async_add_executor_job(actions.backup_usage, hass))


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/delete_actions", vol.Required("action_ids"): vol.All([int], vol.Length(min=1, max=500)),
     vol.Required("confirm"): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_actions(hass, connection, msg) -> None:
    """Remove history records and the backup files they own. They can no longer be undone."""
    if not msg["confirm"]:
        connection.send_error(msg["id"], "confirm_required", "Set confirm to true to delete")
        return
    job = hass.data[DOMAIN].get("job")
    if job and job.get("running"):
        connection.send_error(msg["id"], "busy", "Another action is still running")
        return
    res = await hass.async_add_executor_job(actions.delete_records, hass, msg["action_ids"])
    await _extra_sample(hass)
    connection.send_result(msg["id"], res)


@websocket_api.websocket_command({vol.Required("type"): "db_storage/sample_now"})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_sample_now(hass, connection, msg) -> None:
    connection.send_result(msg["id"], await hass.data[DOMAIN]["sampler"].async_sample())


@websocket_api.websocket_command(
    {
        vol.Required("type"): "db_storage/entity_rows",
        vol.Required("entity_id"): str,
        vol.Optional("kind", default="states"): vol.In(["states", "statistics", "short_term"]),
        vol.Optional("limit", default=25): vol.All(int, vol.Range(min=1, max=200)),
        vol.Optional("cursor"): vol.All([vol.Coerce(float)], vol.Length(min=2, max=2)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_entity_rows(hass, connection, msg) -> None:
    """Read-only: one page of the raw rows stored for an entity (state + attributes, or statistics)."""
    result = await _read(
        hass, lambda s: entity_rows(s, msg["entity_id"], msg["kind"], msg["limit"], msg.get("cursor")))
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/db_size", vol.Optional("checkpoint", default=False): bool,
     vol.Optional("expired", default=False): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_db_size(hass, connection, msg) -> None:
    """Current size and free space, without recording anything (cheap; used while reclaiming).

    With ``checkpoint`` the write-ahead log is first folded into the main file, so the file on
    disk matches the database size (SQLite only; skipped if a reader keeps it from finishing).
    """
    checkpoint = None
    if msg["checkpoint"]:
        instance = get_instance(hass)

        def run() -> Any:
            if instance.engine.dialect.name != "sqlite":
                return None
            with instance.engine.connect() as conn:
                row = conn.exec_driver_sql("PRAGMA wal_checkpoint(TRUNCATE)").fetchone()
            return list(row) if row else None

        try:
            checkpoint = await instance.async_add_executor_job(run)
        except Exception:  # noqa: BLE001 - best effort, the size is still reported
            checkpoint = None
    sample = await hass.data[DOMAIN]["sampler"].async_sample(record=False)
    extra: dict[str, Any] = {}
    if msg["expired"]:
        # What the repack's purge will also delete: states older than the recorder's keep-days limit.
        keep_days = get_instance(hass).keep_days
        cutoff = time.time() - keep_days * 86400
        counts = await _read(hass, lambda s: s.execute(text(
            "SELECT COUNT(*), SUM(CASE WHEN last_updated_ts < :cut THEN 1 ELSE 0 END) FROM states"), {"cut": cutoff}).one())
        total, old = int(counts[0] or 0), int(counts[1] or 0)
        inv = hass.data[DOMAIN].get("inventory")
        tb = {t["table"]: t["bytes"] or 0 for t in inv["scan"]["tables"]} if inv else {}
        per_row = ((tb.get("states", 0) + tb.get("state_attributes", 0)) / total) if total and tb else None
        extra = {"keep_days": keep_days, "expired_rows": old, "expired_bytes": round(old * per_row) if per_row else None}
    connection.send_result(msg["id"], {**(sample or {}), "checkpoint": checkpoint, **extra})


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/reclaim", vol.Required("confirm"): bool}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_reclaim(hass, connection, msg) -> None:
    """Repack the database so space freed by deletions is returned to the disk.

    This is the recorder's own purge-with-repack: it purges nothing beyond your normal
    retention and then rewrites the file (VACUUM on SQLite). It needs free disk space
    roughly equal to the database size and keeps the recorder busy while it runs.
    """
    if not msg["confirm"]:
        connection.send_error(msg["id"], "confirm_required", "Set confirm to true to repack the database")
        return
    instance = get_instance(hass)
    before = await hass.data[DOMAIN]["sampler"].async_sample(record=False)
    await hass.services.async_call(
        "recorder", "purge", {"keep_days": instance.keep_days, "repack": True}, blocking=False
    )
    connection.send_result(msg["id"], {"started": True, "before": before, "keep_days": instance.keep_days})


@websocket_api.websocket_command(
    {vol.Required("type"): "db_storage/usage", vol.Optional("entity_id"): str,
     vol.Optional("entity_ids"): vol.All([str], vol.Length(min=1, max=2000))}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_usage(hass, connection, msg) -> None:
    inv = hass.data[DOMAIN].get("inventory")
    if inv is None:
        connection.send_error(msg["id"], "no_data", "No scan yet")
        return
    usage = inv["usage"]
    if msg.get("entity_ids"):
        ids = list(dict.fromkeys(msg["entity_ids"]))
        dyn = sorted({d for e in ids for d in usage.domain_wide.get(e.split(".", 1)[0], [])})
        connection.send_result(msg["id"], {
            "entity_ids": ids, "locations": merge_locations(usage, ids), "dynamic_possible": dyn,
            "caveats": CAVEATS, "usage_age_s": round(time.time() - inv["ts"])})
        return
    eid = msg.get("entity_id")
    if not eid:
        connection.send_error(msg["id"], "invalid_format", "entity_id or entity_ids is required")
        return
    domain = eid.split(".", 1)[0]
    connection.send_result(
        msg["id"],
        {
            "entity_id": eid,
            "locations": usage.locations.get(eid, []),
            "dynamic_possible": usage.domain_wide.get(domain, []),
            "caveats": CAVEATS,
            "usage_age_s": round(time.time() - inv["ts"]),
        },
    )
