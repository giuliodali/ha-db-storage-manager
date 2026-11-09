"""Cleanup actions with a journal entry for each one, so they can be undone.

Kinds
  disable            turn the entity off in the registry (undo: turn it back on)
  delete_history     delete long-term statistics, after saving a snapshot (undo: restore it);
                     optionally also the recorded state history; one compressed backup file per action holds both
  disable_and_clear  both, disabling first so a live sensor cannot recreate the statistic
"""

from __future__ import annotations

import asyncio
import shutil
import time
from pathlib import Path
from typing import Any, Callable

from homeassistant.components.recorder import get_instance
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from . import retention
from .const import DOMAIN
from .queries import states_older_than
from .recorder_ops import _read, _snapshot_dir, clear_statistics, make_batch_backup, wait_purged
from .backup import BATCH_SUFFIX
from .snapshot import read_snapshot
from .tasks import RestoreBatchTask, RestoreStatisticsTask

KINDS = {
    "disable": "Disable",
    "delete_history": "Clear history",
    "disable_and_clear": "Disable and clear history",
    "reduce_retention": "Change retention",
    "reset_retention": "Change retention",
}
RETENTION_KINDS = ("reduce_retention", "reset_retention")
MAX_ENTITIES = 500
CHUNK = 50


def _check_space(hass: HomeAssistant, est_bytes: int) -> None:
    """Refuse early if the backup could not fit (worst case: uncompressed, roughly the size being cleared)."""
    free = shutil.disk_usage(hass.config.path()).free
    if free < est_bytes + 50 * 1048576:
        raise ValueError(f"Not enough free disk space for the backup ({free // 1048576} MB free, "
                         f"up to {est_bytes // 1048576 + 50} MB needed). Nothing was changed.")


def _inventory_item(hass: HomeAssistant, eid: str) -> dict[str, Any]:
    inv = hass.data[DOMAIN].get("inventory") or {}
    for it in inv.get("items", []):
        if it["entity_id"] == eid:
            return it
    return {}


def _is_live(hass: HomeAssistant, reg: er.RegistryEntry | None, eid: str) -> bool:
    return hass.states.get(eid) is not None and (reg is None or reg.disabled_by is None)


def preview(hass: HomeAssistant, kind: str, entity_ids: list[str], states: bool) -> dict[str, Any]:
    """What an action would do, without doing it."""
    ent_reg = er.async_get(hass)
    rows, total, warnings = [], 0, set()
    tot_stats = tot_states = 0
    for eid in entity_ids:
        it = _inventory_item(hass, eid)
        reg = ent_reg.async_get(eid)
        notes: list[str] = []
        does = []
        if kind in ("disable", "disable_and_clear"):
            if reg is None:
                notes.append("Not in the entity registry, so it cannot be disabled.")
            elif reg.disabled_by is not None:
                notes.append("Already disabled.")
            else:
                does.append("disable")
            if reg is not None and eid in retention.rules(hass):
                does.append("remove its retention rule")
        est = est_stats = est_states = 0
        if kind in ("delete_history", "disable_and_clear"):
            if (it.get("stats_rows") or 0) + (it.get("short_rows") or 0) > 0 or not it:
                does.append("clear long-term statistics")
                est_stats = it.get("stats_bytes", 0)
            if it.get("states_rows"):
                est_states = it.get("states_bytes", 0) + it.get("attrs_bytes", 0)
                if states:
                    does.append("clear state history")
            est = est_stats + (est_states if states else 0)
            if kind == "delete_history" and _is_live(hass, reg, eid):
                notes.append("Still active: Home Assistant will start recording it again within minutes. Use Disable and clear history to stop that.")
                warnings.add("active")
        used = it.get("used_count", 0)
        if used:
            notes.append(f"Referenced in {used} place{'s' if used != 1 else ''} in your config.")
            warnings.add("referenced")
        total += est
        tot_stats += est_stats
        tot_states += est_states
        rows.append({"entity_id": eid, "name": it.get("name") or eid, "does": does, "notes": notes,
                     "est_bytes": round(est), "est_stats_bytes": round(est_stats), "est_states_bytes": round(est_states), "suggestion": it.get("suggestion"), "used_count": used})
    return {"kind": kind, "label": KINDS[kind], "entities": rows, "est_bytes": round(total),
            "est_stats_bytes": round(tot_stats), "est_states_bytes": round(tot_states),
            "warnings": sorted(warnings), "states": states,
            "undo": "Everything here can be undone from the History tab: a compressed backup of what is cleared (statistics"
                    + (" and state history" if states else "") + ") is saved first, and disabling is reversed too."
                    if kind != "disable" else "This can be undone from the History tab."}


def _remove_file(hass: HomeAssistant, name: str) -> int:
    """Delete one backup file (only ever inside the snapshot folder). Returns the bytes freed."""
    base = _snapshot_dir(hass).resolve()
    path = (base / Path(name).name).resolve()
    if path.parent != base or not path.is_file():
        return 0
    size = path.stat().st_size
    path.unlink()
    return size or 1


def _all_names(a: dict[str, Any]) -> list[str]:
    """Every backup file an action's records point to (one file is shared by the whole batch)."""
    names = []
    for e in a["entities"]:
        steps = e.get("steps") or {}
        for n in ((steps.get("statistics") or {}).get("snapshot"), (steps.get("states") or {}).get("backup")):
            if n:
                names.append(Path(n).name)
    return list(dict.fromkeys(names))


def add_backup_info(hass: HomeAssistant, rows: list[dict[str, Any]]) -> None:
    """Attach what is really on disk for each action's backups."""
    base = _snapshot_dir(hass)
    for a in rows:
        sizes = {n: (base / n).stat().st_size for n in _all_names(a) if (base / n).is_file()}
        for e in a["entities"]:
            for step, field in (("statistics", "snapshot"), ("states", "backup")):
                st = (e.get("steps") or {}).get(step) or {}
                if st.get(field):
                    st["exists"] = Path(st[field]).name in sizes
                    st["file_bytes"] = sizes.get(Path(st[field]).name, 0)
        a["backup_bytes"], a["backup_files"] = sum(sizes.values()), len(sizes)
        a["backup_names"] = list(sizes)


def backup_usage(hass: HomeAssistant) -> dict[str, Any]:
    """Size and location of the undo data (backup files plus the history database)."""
    base = _snapshot_dir(hass)
    journal = hass.data[DOMAIN]["journal"]
    linked = {n for a in journal.list_actions(100000) for n in _all_names(a)}
    files = [f for f in base.glob("*.gz")] if base.is_dir() else []
    sizes = {f.name: f.stat().st_size for f in files}
    unlinked = [n for n in sizes if n not in linked]
    return {"path": str(base), "files": len(sizes), "bytes": sum(sizes.values()),
            "unlinked_files": len(unlinked), "unlinked_bytes": sum(sizes[n] for n in unlinked),
            "journal_path": str(base.parent / "journal.db"), "journal_bytes": journal.file_bytes()}


def delete_records(hass: HomeAssistant, ids: list[int]) -> dict[str, Any]:
    """Delete history records and their backup files. Those actions can no longer be undone."""
    journal = hass.data[DOMAIN]["journal"]
    freed = removed = 0
    deletable = []
    for aid in ids:
        a = journal.get_action(aid)
        if a is None or a["status"] == "running":
            continue
        deletable.append(aid)
        for name in _all_names(a):
            n = _remove_file(hass, name)
            freed += n
            removed += 1 if n else 0
    return {"deleted": journal.delete_actions(deletable), "files_removed": removed, "bytes_freed": freed}


async def preview_retention(hass: HomeAssistant, kind: str, entity_ids: list[str], days: int | None,
                            apply_now: bool) -> dict[str, Any]:
    """What a retention change would do: how many old state rows go, and an estimate of the space."""
    rules = retention.rules(hass)
    default = retention.default_days(hass)
    counts: dict[str, int] = {}
    if kind == "reduce_retention":
        cutoff = time.time() - days * 86400
        for i in range(0, len(entity_ids), 200):
            counts.update(await _read(hass, lambda s, c=entity_ids[i:i + 200]: states_older_than(s, c, cutoff)))
    rows, total, warnings = [], 0, set()
    for eid in entity_ids:
        it = _inventory_item(hass, eid)
        notes: list[str] = []
        does: list[str] = []
        n = counts.get(eid, 0)
        est = 0
        no_stats = False
        if kind == "reduce_retention":
            if days >= default:
                notes.append(f"Home Assistant already keeps {default} days, so this rule would change nothing.")
                warnings.add("no_effect")
            else:
                does.append(f"keep {days} days of states")
                if n:
                    est = round(n * (it.get("states_bytes", 0) + it.get("attrs_bytes", 0)) / max(it.get("states_rows") or 1, 1))
                    if apply_now:
                        does.append(f"delete {n:,} old states")
            if it and not ((it.get("stats_rows") or 0) + (it.get("short_rows") or 0)) and it.get("states_rows"):
                notes.append("No long-term statistics: deleted states are gone for good.")
                warnings.add("no_stats")
                no_stats = True
            if eid in rules:
                notes.append(f"Currently keeps {rules[eid]} days.")
        else:
            if eid in rules:
                does.append(f"remove the {rules[eid]}-day rule")
            else:
                notes.append("Has no retention rule.")
        total += est
        rows.append({"entity_id": eid, "name": it.get("name") or eid, "does": does, "notes": notes,
                     "est_bytes": est, "est_stats_bytes": 0, "est_states_bytes": est, "rows": n, "no_stats": no_stats,
                     "suggestion": it.get("suggestion"), "used_count": it.get("used_count", 0)})
    if kind == "reduce_retention":
        undo = "Undo removes the rule" + (" and restores the deleted states." if apply_now else ".")
        extra = ""
    else:
        undo, extra = "Undo puts the rule back.", ""
    return {"kind": kind, "label": KINDS[kind], "entities": rows, "est_bytes": total, "est_stats_bytes": 0, "est_states_bytes": total,
            "warnings": sorted(warnings), "states": True, "days": days, "default_days": default, "apply_now": apply_now,
            "undo": undo + extra}


async def run_retention_action(hass: HomeAssistant, kind: str, entity_ids: list[str], days: int | None, apply_now: bool,
                               progress: dict[str, Any]) -> int:
    journal = hass.data[DOMAIN]["journal"]
    pv = await preview_retention(hass, kind, entity_ids, days, apply_now)
    by = {r["entity_id"]: r for r in pv["entities"]}
    rules = dict(retention.rules(hass))
    records = {}
    for eid in entity_ids:
        r = by[eid]
        records[eid] = {"entity_id": eid, "name": r["name"], "ok": True, "notes": [], "steps": {},
                        "est_stats_bytes": 0, "est_states_bytes": r["est_bytes"], "est_bytes": r["est_bytes"]}
    do_purge = kind == "reduce_retention" and apply_now and days < pv["default_days"]
    if do_purge:
        _check_space(hass, pv["est_bytes"])
    n = len(entity_ids)
    summary = (f"Keep {days} days of states: {n} entit{'y' if n == 1 else 'ies'}" if kind == "reduce_retention"
               else f"Use default retention: {n} entit{'y' if n == 1 else 'ies'}")
    action_id = await hass.async_add_executor_job(journal.add_action, time.time(), kind, summary, list(records.values()), pv["est_bytes"])
    progress.update(action_id=action_id, total=n + 1, done=0, phase="Saving rules")
    # 1. Rules first, so the nightly job and any new data follow them immediately.
    for eid, rec in records.items():
        new = days if kind == "reduce_retention" else None
        rec["steps"]["retention"] = {"old": rules.get(eid), "new": new}
        await retention.async_set_rule(hass, eid, new)
        progress["done"] += 1
    # 2. Optionally clean up what is already older than the new limit, with a backup first.
    if do_purge:
        progress["phase"] = "Saving backup"
        cutoff = time.time() - days * 86400
        try:
            # a margin so the backup always covers what the purge will remove
            backup = await make_batch_backup(hass, action_id, [], entity_ids, states_before=cutoff + 3600)
        except Exception as err:  # noqa: BLE001
            for rec in records.values():
                rec["notes"].append(f"Backup failed, nothing deleted now (the nightly job will still apply the rule): {err}")
            backup, do_purge = None, False
        if do_purge:
            progress["phase"] = "Deleting older state history"
            todo = [e for e in entity_ids if by[e]["rows"]]
            for i in range(0, len(todo), CHUNK):
                await hass.services.async_call("recorder", "purge_entities",
                                               {"entity_id": todo[i:i + CHUNK], "keep_days": days}, blocking=True)
            await wait_purged(hass, todo, days, on_wait=lambda n: progress.update(phase=f"Deleting older state history ({n:,} rows left)"))
            counts = (backup or {}).get("counts", {})
            for eid in todo:
                records[eid]["steps"]["states"] = {"backup": (backup or {}).get("file"), "rows": counts.get(eid, {}).get("states", by[eid]["rows"]),
                                                   "purged": True}
                records[eid]["notes"].append("Older state history deleted.")
    progress["done"] += 1
    ok = all(r["ok"] for r in records.values())
    await hass.async_add_executor_job(lambda: journal.update_action(
        action_id, status="applied" if ok else "partial", entities=list(records.values())))
    return action_id


async def _restore(hass: HomeAssistant, snapshot_name: str) -> dict[str, Any]:
    """Restore one backup file: a batch (all its entities) or a legacy single-statistic snapshot."""
    path = _snapshot_dir(hass) / Path(snapshot_name).name
    loop = asyncio.get_running_loop()
    future: asyncio.Future = loop.create_future()
    if snapshot_name.endswith(BATCH_SUFFIX):
        get_instance(hass).queue_task(RestoreBatchTask(path=path, future=future, loop=loop))
        return await asyncio.wait_for(future, timeout=1800)
    data = await hass.async_add_executor_job(read_snapshot, path)
    get_instance(hass).queue_task(RestoreStatisticsTask(data=data, future=future, loop=loop, merge=True))
    res = await asyncio.wait_for(future, timeout=120)
    return {"entities": {res.get("statistic_id", ""): {"statistics": res.get("statistics", 0),
                                                       "short_term": res.get("short_term", 0), "states": 0}}}


async def _drop_rule(hass: HomeAssistant, eid: str, rec: dict[str, Any]) -> None:
    """A disabled entity records nothing, so its retention rule has no job: remove it (undo puts it back)."""
    old = retention.rules(hass).get(eid)
    if old is not None:
        rec["steps"]["retention"] = {"old": old, "new": None}
        await retention.async_set_rule(hass, eid, None)
        rec["notes"].append(f"Removed its {old}-day retention rule.")


async def run_action(hass: HomeAssistant, kind: str, entity_ids: list[str], states: bool,
                     progress: dict[str, Any]) -> int:
    journal = hass.data[DOMAIN]["journal"]
    ent_reg = er.async_get(hass)
    records: dict[str, dict[str, Any]] = {}
    est = 0
    for eid in entity_ids:
        it = _inventory_item(hass, eid)
        est_stats = it.get("stats_bytes", 0) if kind != "disable" else 0
        est_states = (it.get("states_bytes", 0) + it.get("attrs_bytes", 0)) if (states and kind != "disable") else 0
        records[eid] = {"entity_id": eid, "name": it.get("name") or eid, "ok": True, "steps": {}, "notes": [],
                        "est_stats_bytes": round(est_stats), "est_states_bytes": round(est_states),
                        "est_bytes": round(est_stats + est_states)}
    if kind != "disable":
        est = sum(r["est_bytes"] for r in records.values())
    if kind != "disable":
        _check_space(hass, est)
    summary = f"{KINDS[kind]}: {len(entity_ids)} entit{'y' if len(entity_ids) == 1 else 'ies'}"
    action_id = await hass.async_add_executor_job(
        journal.add_action, time.time(), kind, summary, list(records.values()), est)
    progress.update(action_id=action_id, total=len(entity_ids), done=0)

    def finish_entity(rec: dict[str, Any], note: str | None = None, ok: bool | None = None) -> None:
        if note:
            rec["notes"].append(note)
        if ok is False:
            rec["ok"] = False
        progress["done"] += 1

    # 1. Disable first, so a live sensor cannot recreate statistics we are about to delete.
    if kind in ("disable", "disable_and_clear"):
        progress["phase"] = "Disabling"
        for eid, rec in records.items():
            try:
                reg = ent_reg.async_get(eid)
                if reg is None:
                    rec["steps"]["disabled"] = {"changed": False}
                    finish_entity(rec, "Not in the entity registry; nothing to disable.")
                elif reg.disabled_by is not None:
                    rec["steps"]["disabled"] = {"changed": False}
                    await _drop_rule(hass, eid, rec)
                    finish_entity(rec, "Was already disabled.")
                else:
                    ent_reg.async_update_entity(eid, disabled_by=er.RegistryEntryDisabler.USER)
                    rec["steps"]["disabled"] = {"changed": True}
                    await _drop_rule(hass, eid, rec)
                    finish_entity(rec)
            except Exception as err:  # noqa: BLE001
                finish_entity(rec, f"Disable failed: {err}", ok=False)

    # 2. Save one backup file for the whole batch, then delete long-term statistics (and state history).
    if kind in ("delete_history", "disable_and_clear"):
        progress.update(phase="Saving backup", total=len(records), done=0)  # each phase counts its own entities
        ok_ids = [e for e, r in records.items() if r["ok"]]
        for eid, rec in records.items():
            if not rec["ok"]:
                progress["done"] += 1
        backup = None
        try:
            backup = await make_batch_backup(hass, action_id, ok_ids, ok_ids if states else [])
        except Exception as err:  # noqa: BLE001
            for eid in ok_ids:
                records[eid]["ok"] = False
                records[eid]["notes"].append(f"Backup failed, history kept: {err}")
        counts = (backup or {}).get("counts", {})
        file = (backup or {}).get("file")
        to_clear: list[str] = []
        for eid in ok_ids:
            rec = records[eid]
            progress["done"] += 1
            if not rec["ok"]:
                continue
            c = counts.get(eid, {})
            if c.get("statistics", 0) + c.get("short_term", 0) > 0:
                rec["steps"]["statistics"] = {"snapshot": file, "statistics": c.get("statistics", 0),
                                              "short_term": c.get("short_term", 0), "deleted": False}
                to_clear.append(eid)
            else:
                rec["steps"]["statistics"] = {"snapshot": None, "deleted": False}
                rec["notes"].append("No long-term statistics to clear.")
        progress["phase"] = "Clearing history"
        for i in range(0, len(to_clear), CHUNK):
            chunk = to_clear[i:i + CHUNK]
            try:
                await clear_statistics(hass, chunk)
                for eid in chunk:
                    records[eid]["steps"]["statistics"]["deleted"] = True
            except Exception as err:  # noqa: BLE001
                for eid in chunk:
                    records[eid]["ok"] = False
                    records[eid]["notes"].append(f"Clearing failed: {err}")
        if states:
            progress["phase"] = "Clearing state history"
            ids = [e for e, r in records.items() if r["ok"]]
            try:
                if ids:
                    await hass.services.async_call("recorder", "purge_entities",
                                                   {"entity_id": ids, "keep_days": 0}, blocking=True)
                    left = await wait_purged(hass, ids, 0, on_wait=lambda n: progress.update(phase=f"Clearing state history ({n:,} rows left)"))
                    for eid in ids:
                        rows = counts.get(eid, {}).get("states", 0)
                        records[eid]["steps"]["states"] = {"backup": file if rows else None, "rows": rows, "purged": True}
                        records[eid]["notes"].append("State history cleared." if not left else f"State history is still being cleared ({left:,} rows were left when this stopped waiting).")
            except Exception as err:  # noqa: BLE001
                for eid in ids:
                    records[eid]["notes"].append(f"Clearing state history failed: {err}")

    oks = [r["ok"] for r in records.values()]
    status = "applied" if all(oks) else ("failed" if not any(oks) else "partial")
    await hass.async_add_executor_job(
        lambda: journal.update_action(action_id, status=status, entities=list(records.values())))
    return action_id


def _backup_names(rec: dict[str, Any]) -> list[str]:
    steps = rec.get("steps") or {}
    st, sh = steps.get("statistics") or {}, steps.get("states") or {}
    names = []
    if st.get("deleted") and st.get("snapshot") and not st.get("snapshot_removed"):
        names.append(st["snapshot"])
    if sh.get("purged") and sh.get("backup") and not sh.get("backup_removed"):
        names.append(sh["backup"])
    return list(dict.fromkeys(names))


async def run_undo(hass: HomeAssistant, action_id: int, progress: dict[str, Any]) -> dict[str, Any]:
    journal = hass.data[DOMAIN]["journal"]
    action = await hass.async_add_executor_job(journal.get_action, action_id)
    if action is None:
        raise ValueError("No such action")
    if action["status"] in ("undone", "running"):
        raise ValueError(f"This action is {action['status']} and cannot be undone")
    ent_reg = er.async_get(hass)
    entities = action["entities"]
    by_id = {r["entity_id"]: r for r in entities}
    for rec in entities:
        rec["undo_notes"] = []
    files = list(dict.fromkeys(n for rec in entities for n in _backup_names(rec)))
    progress.update(action_id=action_id, total=len(files) + len(entities), done=0, phase="Restoring")
    problems = 0
    # 1. Restore each backup file as a whole batch.
    for name in files:
        owners = [r for r in entities if name in _backup_names(r)]
        try:
            res = await _restore(hass, name)
            for eid, c in (res.get("entities") or {}).items():
                rec = by_id.get(eid) or (owners[0] if len(owners) == 1 else None)
                if rec is not None:
                    bits = []
                    if c.get("statistics") or c.get("short_term"):
                        bits.append(f"{c.get('statistics', 0):,} long-term and {c.get('short_term', 0):,} short-term statistics rows")
                    if c.get("states"):
                        bits.append(f"{c['states']:,} state rows")
                    rec["undo_notes"].append("Restored " + (" and ".join(bits) if bits else "nothing new (already present)") + ".")
            if await hass.async_add_executor_job(_remove_file, hass, name) is not None:
                for rec in owners:
                    st, sh = rec["steps"].get("statistics") or {}, rec["steps"].get("states") or {}
                    if st.get("snapshot") == name:
                        st["snapshot_removed"] = True
                    if sh.get("backup") == name:
                        sh["backup_removed"] = True
                    rec["undo_notes"].append("Backup file removed.")
        except Exception as err:  # noqa: BLE001
            problems += 1
            for rec in owners:
                rec["undo_notes"].append(f"Restore failed: {err}")
        progress["done"] += 1
    # 2. Put retention rules back as they were, and turn disabled entities back on.
    for rec in entities:
        try:
            ret = (rec.get("steps") or {}).get("retention")
            if ret is not None:
                await retention.async_set_rule(hass, rec["entity_id"], ret.get("old"))
                rec["undo_notes"].append(f"Retention rule back to {ret['old']} days." if ret.get("old") else "Retention rule removed (default retention).")
            if (rec.get("steps", {}).get("disabled") or {}).get("changed"):
                reg = ent_reg.async_get(rec["entity_id"])
                if reg is not None and reg.disabled_by == er.RegistryEntryDisabler.USER:
                    ent_reg.async_update_entity(rec["entity_id"], disabled_by=None)
                    rec["undo_notes"].append("Enabled again.")
                else:
                    rec["undo_notes"].append("Left as is: it was changed after this action.")
        except Exception as err:  # noqa: BLE001
            problems += 1
            rec["undo_notes"].append(f"Undo failed: {err}")
        progress["done"] += 1
    status = "undone" if not problems else "undo_partial"
    await hass.async_add_executor_job(lambda: journal.update_action(
        action_id, status=status, undone_ts=time.time(), entities=entities))
    return {"action_id": action_id, "status": status, "problems": problems}
