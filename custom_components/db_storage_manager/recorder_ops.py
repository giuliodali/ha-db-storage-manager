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
