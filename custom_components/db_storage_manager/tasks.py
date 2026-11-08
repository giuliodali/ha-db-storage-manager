"""Writes that must run on the recorder's own thread."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any

from homeassistant.components.recorder import Recorder
from homeassistant.components.recorder.tasks import RecorderTask
from homeassistant.helpers.recorder import session_scope

from pathlib import Path

from .backup import restore_batch
from .snapshot import restore_statistics


@dataclass(slots=True)
class RestoreStatisticsTask(RecorderTask):
    """Re-insert a statistics snapshot through the recorder queue.

    Running on the recorder thread avoids a second SQLite writer.
    """

    data: dict[str, Any]
    future: asyncio.Future
    loop: asyncio.AbstractEventLoop
    merge: bool = True

    def run(self, instance: Recorder) -> None:
        try:
            with session_scope(session=instance.get_session()) as session:
                result = restore_statistics(session, self.data, self.merge)
        except Exception as err:  # noqa: BLE001
            self.loop.call_soon_threadsafe(_set, self.future, None, err)
        else:
            self.loop.call_soon_threadsafe(_set, self.future, result, None)


@dataclass(slots=True)
class RestoreBatchTask(RecorderTask):
    """Re-insert a whole batch backup (statistics and state history) on the recorder thread."""

    path: Path
    future: asyncio.Future
    loop: asyncio.AbstractEventLoop

    def run(self, instance: Recorder) -> None:
        try:
            with session_scope(session=instance.get_session()) as session:
                result = restore_batch(session, self.path)
        except Exception as err:  # noqa: BLE001
            self.loop.call_soon_threadsafe(_set, self.future, None, err)
        else:
            self.loop.call_soon_threadsafe(_set, self.future, result, None)


def _set(future: asyncio.Future, result: Any, err: Exception | None) -> None:
    if future.done():
        return
    if err is not None:
        future.set_exception(err)
    else:
        future.set_result(result)
