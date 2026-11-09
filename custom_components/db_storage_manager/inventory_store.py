"""Persist the last inventory so the panel is instant after a restart. No Home Assistant imports."""

from __future__ import annotations

import gzip
import json
import os
from dataclasses import asdict
from pathlib import Path
from typing import Any

from .const import SCAN_VERSION
from .usage import Usage

FORMAT = 1


def save(path: Path, cache: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = {
        "format": FORMAT, "scan_version": SCAN_VERSION,
        "ts": cache["ts"], "scan": cache["scan"], "timings_ms": cache["timings_ms"],
        "items": cache["items"], "usage": asdict(cache["usage"]),
    }
    tmp = path.with_suffix(".tmp")
    with gzip.open(tmp, "wt", encoding="utf-8") as fh:
        json.dump(doc, fh)
    os.replace(tmp, path)


def load(path: Path) -> dict[str, Any] | None:
    try:
        with gzip.open(path, "rt", encoding="utf-8") as fh:
            doc = json.load(fh)
        if doc.get("format") != FORMAT or doc.get("scan_version") != SCAN_VERSION:
            return None
        return {
            "ts": doc["ts"], "scan": doc["scan"], "timings_ms": doc["timings_ms"],
            "items": doc["items"], "usage": Usage(**doc["usage"]), "from_disk": True,
        }
    except Exception:  # noqa: BLE001 - a bad cache file just means a fresh scan
        return None
