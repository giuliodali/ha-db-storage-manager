"""Per-entity state-history retention.

Home Assistant keeps every entity's state history for one global number of days. A rule here
shortens that for one entity ("keep 7 days of this chatty sensor"). A rule can only shorten, never
lengthen, because Home Assistant's own purge still applies.

Rules live in .storage. A nightly job (after Home Assistant's own purge) deletes rows older than
each rule using the recorder's purge_entities service. Only long-term statistics are untouched.
Rows deleted by the nightly job are not backed up (it is a rolling window by design); the first
clean-up when you create a rule is backed up and can be undone.
"""

from __future__ import annotations

import logging
import time
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.recorder import get_instance
from homeassistant.helpers import entity_registry as er
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN
from .queries import states_older_than
from .recorder_ops import _read

_LOGGER = logging.getLogger(__name__)
STORE_KEY = f"{DOMAIN}.retention"
DEFAULT_RUN = (4, 35)
CHUNK = 100
MAX_DAYS = 3650


async def async_load(hass: HomeAssistant) -> None:
    store = Store(hass, 1, STORE_KEY)
    data = await store.async_load() or {}
    hass.data[DOMAIN]["retention"] = {
        "store": store,
        "rules": {k: int(v) for k, v in (data.get("rules") or {}).items()},
        "last_run": data.get("last_run"),
    }


_LISTENERS: list = []


def add_listener(cb) -> Any:
    """Call cb() whenever the rules or the last run change (used by the sensors)."""
    _LISTENERS.append(cb)
    return lambda: _LISTENERS.remove(cb) if cb in _LISTENERS else None


def _notify() -> None:
    for cb in list(_LISTENERS):
        cb()


def configure(hass: HomeAssistant, enabled: bool, hhmm: str) -> None:
    """The nightly schedule from the integration's options."""
    try:
        hour, minute = (int(x) for x in hhmm.split(":")[:2])
    except (ValueError, AttributeError):
        hour, minute = DEFAULT_RUN
    hass.data[DOMAIN]["retention_cfg"] = {"enabled": enabled, "hour": hour, "minute": minute}


def _cfg(hass: HomeAssistant) -> dict[str, Any]:
    return hass.data[DOMAIN].get("retention_cfg") or {"enabled": True, "hour": DEFAULT_RUN[0], "minute": DEFAULT_RUN[1]}


def _state(hass: HomeAssistant) -> dict[str, Any]:
    return hass.data[DOMAIN]["retention"]


def rules(hass: HomeAssistant) -> dict[str, int]:
    return _state(hass)["rules"]


def default_days(hass: HomeAssistant) -> int:
    return int(get_instance(hass).keep_days)


async def async_set_rule(hass: HomeAssistant, entity_id: str, days: int | None) -> None:
    """Set (or with None remove) one entity's rule and save."""
    st = _state(hass)
    if days is None:
        st["rules"].pop(entity_id, None)
    else:
        st["rules"][entity_id] = int(days)
    await _save(hass)
    _notify()


async def async_prune(hass: HomeAssistant) -> list[str]:
    """Drop rules for entities that no longer exist anywhere (not in the registry, no state), and return them."""
    reg = er.async_get(hass)
    st = _state(hass)
    gone = [e for e in st["rules"] if reg.async_get(e) is None and hass.states.get(e) is None]
    if gone:
        for e in gone:
            st["rules"].pop(e, None)
        await _save(hass)
        _notify()
        _LOGGER.info("Removed %s retention rule(s) for entities that no longer exist: %s", len(gone), ", ".join(gone))
    return gone


async def _save(hass: HomeAssistant) -> None:
    st = _state(hass)
    await st["store"].async_save({"rules": st["rules"], "last_run": st["last_run"]})


def status(hass: HomeAssistant) -> dict[str, Any]:
    st, c = _state(hass), _cfg(hass)
    return {"rules": len(st["rules"]), "default_days": default_days(hass), "last_run": st["last_run"],
            "run_at": f"{c['hour']:02d}:{c['minute']:02d}" if c["enabled"] else None}


def _groups(rule_map: dict[str, int]) -> dict[int, list[str]]:
    out: dict[int, list[str]] = {}
    for eid, days in rule_map.items():
        out.setdefault(days, []).append(eid)
    return out


def plan(hass: HomeAssistant) -> list[tuple[int, list[str]]]:
    """The rules that still matter, as (days, entities) in ascending days. Rules at or above Home Assistant's own limit are skipped."""
    default = default_days(hass)
    return sorted((d, sorted(ids)) for d, ids in _groups(_state(hass)["rules"]).items() if d < default)


async def async_count(hass: HomeAssistant) -> dict[str, int]:
    """How many states each rule is about to delete. Used as the first step of the automation, so its last step can report it."""
    await async_prune(hass)
    now = time.time()
    due: dict[str, int] = {}
    for days, ids in plan(hass):
        for i in range(0, len(ids), CHUNK):
            chunk = ids[i:i + CHUNK]
            counts = await _read(hass, lambda s, c=chunk, cut=now - days * 86400: states_older_than(s, c, cut))
            due.update({e: n for e, n in counts.items() if n})
    hass.data[DOMAIN]["retention_due"] = {"ts": now, "due": due}
    return due


async def async_record(hass: HomeAssistant) -> dict[str, Any]:
    """Last step of the automation (after its purge steps): record what the run deleted."""
    pending = hass.data[DOMAIN].pop("retention_due", None) or {"ts": time.time(), "due": {}}
    await get_instance(hass).async_block_till_done()
    return await _finish(hass, pending["due"], pending["ts"])


async def async_run(hass: HomeAssistant, *_: Any) -> dict[str, Any]:
    """Apply every rule now, all in one call (the built-in schedule and the plain service use this)."""
    await async_prune(hass)
    now = time.time()
    purged: dict[str, int] = {}
    for days, ids in plan(hass):
        cutoff = now - days * 86400
        for i in range(0, len(ids), CHUNK):
            chunk = ids[i:i + CHUNK]
            counts = await _read(hass, lambda s, c=chunk: states_older_than(s, c, cutoff))
            todo = [e for e in chunk if counts.get(e)]
            if not todo:
                continue
            await hass.services.async_call("recorder", "purge_entities", {"entity_id": todo, "keep_days": days}, blocking=True)
            purged.update({e: counts[e] for e in todo})
    await get_instance(hass).async_block_till_done()
    await hass.services.async_call("recorder", "purge", {"repack": True}, blocking=False)  # return the space, as the automation does
    return await _finish(hass, purged, now)


async def _finish(hass: HomeAssistant, purged: dict[str, int], now: float) -> dict[str, Any]:
    st = _state(hass)
    journal = hass.data[DOMAIN]["journal"]
    default = default_days(hass)
    st["last_run"] = {"ts": now, "rows": sum(purged.values()), "entities": len(purged)}
    await _save(hass)
    _LOGGER.info("Retention rules ran: %s state rows deleted for %s entities", st["last_run"]["rows"], st["last_run"]["entities"])
    hass.bus.async_fire(f"{DOMAIN}_retention_run", {**st["last_run"], "rules": len(st["rules"]), "default_days": default})
    _notify()
    if purged:
        recs = [{"entity_id": e, "name": _name(hass, e), "ok": True, "notes": [f"Rule keeps {st['rules'].get(e)} days."],
                 "steps": {"states": {"backup": None, "rows": n, "purged": True}}} for e, n in purged.items()]
        n_rows = sum(purged.values())
        aid = await hass.async_add_executor_job(
            journal.add_action, now, "retention_run",
            f"Retention rules: {n_rows:,} state rows deleted for {len(purged)} entit{'y' if len(purged) == 1 else 'ies'}", recs, None)
        await hass.async_add_executor_job(lambda: journal.update_action(aid, status="applied"))
    return st["last_run"]


def _name(hass: HomeAssistant, eid: str) -> str:
    st = hass.states.get(eid)
    return (st.attributes.get("friendly_name") if st else None) or eid


def next_run_ts(hass: HomeAssistant) -> float | None:
    c = _cfg(hass)
    if not c["enabled"]:
        return None
    now = datetime.now().astimezone()
    nxt = now.replace(hour=c["hour"], minute=c["minute"], second=0, microsecond=0)
    if nxt <= now:
        nxt += timedelta(days=1)
    return nxt.timestamp()
