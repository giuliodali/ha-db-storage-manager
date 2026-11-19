"""The Settings page: display options, the recorder's default state retention, and long-term statistics retention.

- Hide automations: a display option saved in .storage.
- Default state retention is Home Assistant's own `recorder: purge_keep_days`. The page only predicts the
  effect of a value and shows the YAML to set; the user edits their configuration and restarts.
- Long-term statistics are kept forever by Home Assistant. A limit set here (in 6-month steps, separately
  for the statistics the Energy dashboard uses) is applied once a month, by the first nightly retention
  run of the month, by deleting hourly statistics rows older than the limit. Nothing else changes them.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass
from typing import Any

from homeassistant.components.recorder import Recorder, get_instance
from homeassistant.components.recorder.tasks import RecorderTask
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.recorder import session_scope
from homeassistant.helpers.storage import Store
from sqlalchemy import bindparam, text

from .const import DOMAIN
from .recorder_ops import _read

_LOGGER = logging.getLogger(__name__)
STORE_KEY = f"{DOMAIN}.settings"
MONTH_S = 30.4375 * 86400
MONTH_STEPS = tuple(range(6, 85, 6))  # 6 months to 7 years
TRIM_BATCH = 20000
DEFAULTS = {"hide_automations": True, "stats_keep_months": None, "energy_stats_keep_months": None, "last_stats_trim": None}


async def async_load(hass: HomeAssistant) -> None:
    store = Store(hass, 1, STORE_KEY)
    data = await store.async_load() or {}
    hass.data[DOMAIN]["settings"] = {"store": store, "data": {**DEFAULTS, **{k: v for k, v in data.items() if k in DEFAULTS}}}


def get(hass: HomeAssistant) -> dict[str, Any]:
    return hass.data[DOMAIN]["settings"]["data"]


async def async_update(hass: HomeAssistant, patch: dict[str, Any]) -> dict[str, Any]:
    st = hass.data[DOMAIN]["settings"]
    st["data"].update({k: v for k, v in patch.items() if k in DEFAULTS})
    await st["store"].async_save(st["data"])
    return st["data"]


# --- recorder keep days ----------------------------------------------------------------------

def recorder_status(hass: HomeAssistant) -> dict[str, Any]:
    """The keep-days value the recorder is running with. Read only: the user sets it in their YAML."""
    return {"running_days": int(get_instance(hass).keep_days)}


# --- predictions ------------------------------------------------------------------------------

_STATE_HIST = text("SELECT CAST((:now - last_updated_ts) / 86400 AS INTEGER) AS d, COUNT(*) AS n FROM states GROUP BY d")
_STATE_HIST_IDS = text(
    "SELECT CAST((:now - s.last_updated_ts) / 86400 AS INTEGER) AS d, COUNT(*) AS n FROM states s "
    "JOIN states_meta sm ON sm.metadata_id = s.metadata_id WHERE sm.entity_id IN :ids GROUP BY d"
).bindparams(bindparam("ids", expanding=True))
_STATS_HIST = text(
    "SELECT metadata_id AS mid, CAST((:now - start_ts) / :month AS INTEGER) AS m, COUNT(*) AS n FROM statistics GROUP BY mid, m")
_META = text("SELECT id, statistic_id FROM statistics_meta")


def _hist(rows, cap: int) -> list[int]:
    out: list[int] = []
    for d, n in rows:
        d = max(0, min(int(d or 0), cap))
        if d >= len(out):
            out.extend([0] * (d + 1 - len(out)))
        out[d] += int(n)
    return out


def _states_prediction(session, now: float, ruled: list[str]) -> dict[str, Any]:
    total = _hist(session.execute(_STATE_HIST, {"now": now}).all(), 3650)
    # Growth if the default is raised comes only from entities without a rule of their own (a rule caps them).
    unruled = list(total)
    for i in range(0, len(ruled), 400):
        for d, n in enumerate(_hist(session.execute(_STATE_HIST_IDS, {"now": now, "ids": ruled[i:i + 400]}).all(), 3650)):
            if d < len(unruled):
                unruled[d] -= n
    days = min(7, max(1, len(unruled) - 1))
    week = sum(unruled[1:days + 1])  # whole days only; today (index 0) is partial
    return {"hist": total, "rows": sum(total), "rate_per_day": round(week / days) if unruled else 0}


def _stats_prediction(session, now: float, energy_ids: set[str]) -> dict[str, Any]:
    meta = {mid: sid for mid, sid in session.execute(_META).all()}
    energy: list[int] = []
    other: list[int] = []
    for mid, m, n in session.execute(_STATS_HIST, {"now": now, "month": MONTH_S}).all():
        h = energy if meta.get(mid) in energy_ids else other
        m = max(0, min(int(m or 0), 240))
        if m >= len(h):
            h.extend([0] * (m + 1 - len(h)))
        h[m] += int(n)
    return {"other": other, "energy": energy}


async def async_predict(hass: HomeAssistant) -> dict[str, Any]:
    from . import retention  # noqa: PLC0415

    now = time.time()
    ruled = list(retention.rules(hass))
    energy_ids = await async_energy_statistic_ids(hass)
    states = await _read(hass, lambda s: _states_prediction(s, now, ruled))
    stats = await _read(hass, lambda s: _stats_prediction(s, now, energy_ids))
    stats["energy_ids"] = sorted(energy_ids)  # what the Settings link lists: the Referenced In "Energy dashboard" entities
    inv = hass.data[DOMAIN].get("inventory")
    tb = {t["table"]: t["bytes"] or 0 for t in inv["scan"]["tables"]} if inv else {}
    tr = {t["table"]: t.get("rows") or 0 for t in inv["scan"]["tables"]} if inv else {}
    s_rows = tr.get("states") or states["rows"]
    st_rows = tr.get("statistics") or (sum(stats["other"]) + sum(stats["energy"]))
    return {
        "states": {**states, "bytes_per_row": ((tb.get("states", 0) + tb.get("state_attributes", 0)) / s_rows) if s_rows and tb else None},
        "statistics": {**stats, "energy_count": len(stats["energy_ids"]),
                       "bytes_per_row": (tb.get("statistics", 0) / st_rows) if st_rows and tb else None},
        "scan_ts": inv["ts"] if inv else None,
    }


# --- Energy dashboard statistics ---------------------------------------------------------------

def stat_ids_in(data: Any) -> set[str]:
    """Every statistic id named in the Energy dashboard's preferences (keys starting with stat_)."""
    out: set[str] = set()
    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, str) and k.startswith("stat_") and v:
                out.add(v)
            else:
                out |= stat_ids_in(v)
    elif isinstance(data, list):
        for v in data:
            out |= stat_ids_in(v)
    return out


ENERGY_KIND = "Energy dashboard"


async def async_energy_statistic_ids(hass: HomeAssistant) -> set[str]:
    """Statistics the Energy dashboard uses: the same set as the Referenced In facet's "Energy dashboard" value
    (what its configuration names plus the cost sensors it creates; see usage_sources._scan_energy).

    Read from the last scan, so the Settings page and the Entities filter always agree; without a scan,
    straight from the Energy preferences and the entity registry.
    """
    inv = hass.data[DOMAIN].get("inventory")
    if inv is not None:
        return {i["entity_id"] for i in inv["items"] if ENERGY_KIND in (i.get("used_in") or [])}
    ids: set[str] = set()
    if "energy" in hass.config.components:
        from homeassistant.components.energy.data import async_get_manager  # noqa: PLC0415

        try:
            ids |= stat_ids_in((await async_get_manager(hass)).data or {})
        except Exception:  # noqa: BLE001
            pass
    ids |= {e.entity_id for e in er.async_get(hass).entities.values() if e.platform == "energy"}
    return ids


# --- monthly long-term statistics trim ---------------------------------------------------------

# The extra derived table lets MySQL/MariaDB accept the LIMIT inside IN (...).
_DEL = text("DELETE FROM statistics WHERE id IN (SELECT id FROM (SELECT id FROM statistics "
            "WHERE metadata_id IN :mids AND start_ts < :cut LIMIT :n) AS old)").bindparams(bindparam("mids", expanding=True))


@dataclass(slots=True)
class TrimStatisticsTask(RecorderTask):
    """Delete up to one batch of old hourly statistics on the recorder thread (so there is one writer)."""

    groups: list[tuple[list[int], float]]
    future: asyncio.Future
    loop: asyncio.AbstractEventLoop

    def run(self, instance: Recorder) -> None:
        deleted = 0
        try:
            with session_scope(session=instance.get_session()) as session:
                for mids, cut in self.groups:
                    for i in range(0, len(mids), 500):
                        if deleted >= TRIM_BATCH:
                            break
                        deleted += session.execute(_DEL, {"mids": mids[i:i + 500], "cut": cut, "n": TRIM_BATCH - deleted}).rowcount or 0
        except Exception as err:  # noqa: BLE001
            self.loop.call_soon_threadsafe(lambda: self.future.done() or self.future.set_exception(err))
        else:
            self.loop.call_soon_threadsafe(lambda: self.future.done() or self.future.set_result(deleted))


def trim_due(hass: HomeAssistant, now: float) -> bool:
    """True on the first run of a calendar month (or if it has never run), when a limit is set."""
    s = get(hass)
    if s["stats_keep_months"] is None and s["energy_stats_keep_months"] is None:
        return False
    last = s.get("last_stats_trim")
    if not last:
        return True
    a, b = time.localtime(last["ts"]), time.localtime(now)
    return (a.tm_year, a.tm_mon) != (b.tm_year, b.tm_mon)


async def async_trim_statistics(hass: HomeAssistant, now: float | None = None) -> dict[str, Any]:
    """Delete hourly long-term statistics older than the limits. Not backed up. Returns {"rows", "ts"}."""
    now = now or time.time()
    s = get(hass)
    energy_ids = await async_energy_statistic_ids(hass)
    meta = await _read(hass, lambda ses: ses.execute(_META).all())
    groups: list[tuple[list[int], float]] = []
    for months, pick in ((s["stats_keep_months"], lambda sid: sid not in energy_ids),
                         (s["energy_stats_keep_months"], lambda sid: sid in energy_ids)):
        if months:
            mids = [mid for mid, sid in meta if pick(sid)]
            if mids:
                groups.append((mids, now - months * MONTH_S))
    total = 0
    instance = get_instance(hass)
    loop = asyncio.get_running_loop()
    while groups:
        fut: asyncio.Future = loop.create_future()
        instance.queue_task(TrimStatisticsTask(groups, fut, loop))
        n = await asyncio.wait_for(fut, timeout=600)
        total += n
        if n < TRIM_BATCH:
            break
        await asyncio.sleep(0.5)  # let the recorder write what queued up meanwhile
    result = {"ts": now, "rows": total}
    await async_update(hass, {"last_stats_trim": result})
    _LOGGER.info("Long-term statistics retention: %s hourly rows deleted", total)
    return result
