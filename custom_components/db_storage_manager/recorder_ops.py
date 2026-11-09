"""Recorder helpers shared by the websocket API and the action runner."""

from __future__ import annotations

import asyncio
import re
import time
from pathlib import Path
from typing import Any, Callable

from homeassistant.components.recorder import get_instance
from homeassistant.core import HomeAssistant
from homeassistant.helpers.recorder import session_scope
from sqlalchemy import bindparam, text

from .const import SNAPSHOT_DIR
from .backup import BATCH_SUFFIX, export_batch
from .snapshot import export_statistics, write_snapshot


def _snapshot_dir(hass: HomeAssistant) -> Path:
    return Path(hass.config.path(SNAPSHOT_DIR))


def _safe(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.-]", "_", name)


async def _read(hass: HomeAssistant, fn: Callable[[Any], Any]) -> Any:
    """Run a read-only function with a recorder session in the recorder's executor."""
    instance = get_instance(hass)

    def run() -> Any:
        with session_scope(hass=hass, read_only=True) as session:
            return fn(session)

    return await instance.async_add_executor_job(run)


async def _make_snapshot(hass: HomeAssistant, statistic_id: str) -> dict[str, Any] | None:
    data = await _read(hass, lambda s: export_statistics(s, statistic_id))
    if data is None:
        return None
    name = f"{_safe(statistic_id)}-{time.strftime('%Y%m%d-%H%M%S')}.json.gz"
    path = _snapshot_dir(hass) / name
    size = await hass.async_add_executor_job(write_snapshot, path, data)
    return {
        "snapshot": name,
        "bytes": size,
        "statistics": len(data["statistics"]),
        "short_term": len(data["statistics_short_term"]),
    }


async def clear_statistics(hass: HomeAssistant, statistic_ids: list[str], timeout: int = 300) -> None:
    """Delete long-term statistics and wait until the recorder has really finished.

    async_block_till_done() returns at once when the queue is empty, even if the clear task
    is mid-run, so this waits on the task's own completion callback instead.
    """
    clear = getattr(get_instance(hass), "async_clear_statistics", None)
    if clear is None:
        raise RuntimeError("Recorder has no async_clear_statistics")
    loop = asyncio.get_running_loop()
    done: asyncio.Future = loop.create_future()

    def _on_done() -> None:
        loop.call_soon_threadsafe(lambda: done.done() or done.set_result(None))

    clear(list(statistic_ids), on_done=_on_done)
    await asyncio.wait_for(done, timeout=timeout)


async def make_batch_backup(hass: HomeAssistant, action_id: int, statistic_ids: list[str],
                            state_entity_ids: list[str], states_before: float | None = None) -> dict[str, Any] | None:
    """One compressed file with everything an action is about to clear. None if there is nothing to save."""
    if not statistic_ids and not state_entity_ids:
        return None
    name = f"action-{action_id}-{time.strftime('%Y%m%d-%H%M%S')}{BATCH_SUFFIX}"
    path = _snapshot_dir(hass) / name
    out = await _read(hass, lambda s: export_batch(s, path, statistic_ids, state_entity_ids, states_before))
    if not any(sum(c.values()) for c in out["counts"].values()):
        path.unlink(missing_ok=True)
        return None
    return {"file": name, "bytes": out["bytes"], "counts": out["counts"]}


_LEFT_SQL = text(
    "SELECT COUNT(*) FROM states s JOIN states_meta sm ON sm.metadata_id = s.metadata_id "
    "WHERE sm.entity_id IN :ids AND s.last_updated_ts < :before"
).bindparams(bindparam("ids", expanding=True))


def _rows_left(session: Any, entity_ids: list[str], before: float) -> int:
    total = 0
    for i in range(0, len(entity_ids), 400):
        total += int(session.execute(_LEFT_SQL, {"ids": entity_ids[i:i + 400], "before": before}).scalar() or 0)
    return total


async def wait_purged(hass: HomeAssistant, entity_ids: list[str], keep_days: float = 0,
                      timeout: float = 1800, on_wait: Callable[[int], None] | None = None) -> int:
    """Wait until the recorder has really deleted the states a purge_entities call asked for.

    A purge of an entity with many rows re-queues itself, behind the point async_block_till_done()
    waits for, so that call can return while rows are still being deleted. This polls the rows
    left (older than the keep-days limit) until none remain. Returns how many were still there
    when it gave up (0 when finished).
    """
    if not entity_ids:
        return 0
    instance = get_instance(hass)
    before = time.time() - keep_days * 86400
    deadline = time.monotonic() + timeout
    while True:
        await instance.async_block_till_done()
        left = await _read(hass, lambda s: _rows_left(s, entity_ids, before))
        if left == 0 or time.monotonic() > deadline:
            return left
        if on_wait:
            on_wait(left)
        await asyncio.sleep(1.5)
