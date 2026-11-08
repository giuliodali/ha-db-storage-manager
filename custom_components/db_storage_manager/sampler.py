"""Cheap size sampling: file size plus free pages. Never runs dbstat.

An hourly timer checks whether the configured snapshot interval has elapsed. Only then
is a measurement taken, written to the history and pushed to the sensors, so the sensors
never change (and Home Assistant records nothing for them) between snapshots.
"""

from __future__ import annotations

import logging
import os
import time
from collections.abc import Callable
from typing import Any

from sqlalchemy.engine import make_url

from homeassistant.components.recorder import get_instance
from homeassistant.core import HomeAssistant
from homeassistant.helpers.recorder import session_scope

from .const import SNAPSHOT_DIR
from .journal import Journal
from .queries import page_stats, statistics_bytes

_LOGGER = logging.getLogger(__name__)


class SizeSampler:
    def __init__(self, hass: HomeAssistant, journal: Journal, interval_s: int = 86400) -> None:
        self.hass = hass
        self.journal = journal
        self.interval_s = interval_s
        self.last_recorded: float | None = None
        self.last: dict[str, Any] | None = None
        self._listeners: list[Callable[[dict[str, Any]], None]] = []

    def add_listener(self, cb: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.append(cb)
        return lambda: self._listeners.remove(cb)

    def _db_file(self) -> str | None:
        url = make_url(str(get_instance(self.hass).db_url))
        if url.get_backend_name() == "sqlite" and url.database and os.path.isfile(url.database):
            return url.database
        return None

    def due(self) -> bool:
        # Five minutes of slack so an hourly timer is not a tick late for a one-hour interval.
        return self.last_recorded is None or time.time() - self.last_recorded >= self.interval_s - 300

    async def async_tick(self, _now: Any = None) -> None:
        """Timer/startup entry point: measure and record only when a snapshot is due."""
        if self.due():
            await self.async_sample(record=True)

    async def async_sample(self, _now: Any = None, *, record: bool = True) -> dict[str, Any] | None:
        instance = get_instance(self.hass)
        path = self._db_file()

        def run() -> dict[str, Any] | None:
            with session_scope(hass=self.hass, read_only=True) as session:
                pages = page_stats(session)
                stats = statistics_bytes(session) if record else None
            # Home Assistant runs SQLite in WAL mode, where recent pages (and the output of a
            # repack) can sit in the "-wal" file until a checkpoint. The size of the database is
            # therefore its page count times page size, which matches what tools such as SQLite
            # Web report, not the main file alone. Both pieces are returned for transparency.
            main = os.path.getsize(path) if path else None
            wal = os.path.getsize(path + "-wal") if path and os.path.isfile(path + "-wal") else 0
            size = (pages or {}).get("total_bytes") or main
            if not size:
                return None
            undo = 0
            snap = self.hass.config.path(SNAPSHOT_DIR)
            if os.path.isdir(snap):  # backup files kept for undo
                undo = sum(e.stat().st_size for e in os.scandir(snap) if e.is_file() and e.name.endswith(".gz"))
            return {
                "ts": time.time(),
                "file_bytes": int(size),
                "free_bytes": (pages or {}).get("free_bytes"),
                "main_bytes": main,
                "wal_bytes": wal,
                "undo_bytes": undo,
                "stats_bytes": stats,
            }

        try:
            sample = await instance.async_add_executor_job(run)
        except Exception:  # noqa: BLE001 - recorder may still be starting
            _LOGGER.debug("Size sample skipped", exc_info=True)
            return None
        if sample is None:
            return None
        if not record:  # a look at the current size: no history row, no sensor update
            return sample
        await self.hass.async_add_executor_job(
            self.journal.add_size, sample["ts"], sample["file_bytes"], sample["free_bytes"], None, sample["undo_bytes"], sample["stats_bytes"]
        )
        self.last_recorded = sample["ts"]
        self.last = sample
        for cb in list(self._listeners):
            cb(sample)
        return sample
