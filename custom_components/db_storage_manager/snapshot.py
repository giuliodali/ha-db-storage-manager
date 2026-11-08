"""Export and restore long-term statistics. No Home Assistant imports.

Column names are read from the live schema, so snapshots survive recorder
schema changes between export and restore as long as the columns still exist.
"""

from __future__ import annotations

import gzip
import json
import re
import time
from pathlib import Path
from typing import Any

from sqlalchemy import text

_IDENT = re.compile(r"^[a-z_][a-z0-9_]*$")
_CHUNK = 2000
SNAPSHOT_VERSION = 1


def _clean(row: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in row.items() if k not in ("id", "metadata_id")}


def export_statistics(session, statistic_id: str) -> dict[str, Any] | None:
    meta = session.execute(
        text("SELECT * FROM statistics_meta WHERE statistic_id = :sid"), {"sid": statistic_id}
    ).mappings().first()
    if meta is None:
        return None
    mid = meta["id"]
    data: dict[str, Any] = {
        "snapshot_version": SNAPSHOT_VERSION,
        "created": time.time(),
        "statistic_id": statistic_id,
        "meta": _clean(dict(meta)),
    }
    for table in ("statistics", "statistics_short_term"):
        rows = session.execute(
            text(f"SELECT * FROM {table} WHERE metadata_id = :m"), {"m": mid}  # noqa: S608
        ).mappings().all()
        data[table] = [_clean(dict(r)) for r in rows]
    return data


def write_snapshot(path: Path, data: dict[str, Any]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(path, "wt", encoding="utf-8") as fh:
        json.dump(data, fh, default=str)
    return path.stat().st_size


def read_snapshot(path: Path) -> dict[str, Any]:
    with gzip.open(path, "rt", encoding="utf-8") as fh:
        return json.load(fh)


def _insert(session, table: str, rows: list[dict[str, Any]]) -> None:
    if not rows:
        return
    cols = list(rows[0].keys())
    for c in cols:
        if not _IDENT.match(c):
            raise ValueError(f"unsafe column name in snapshot: {c!r}")
    sql = text(
        f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({', '.join(':' + c for c in cols)})"  # noqa: S608
    )
    for i in range(0, len(rows), _CHUNK):
        session.execute(sql, rows[i : i + _CHUNK])


def restore_statistics(session, data: dict[str, Any], merge: bool = True) -> dict[str, Any]:
    """Re-insert a snapshot.

    If the statistic exists again (a live sensor recreates it within minutes of a
    delete), ``merge=True`` adds only the rows whose ``start_ts`` is missing and
    keeps what the recorder wrote since. ``merge=False`` refuses instead.
    """
    sid = data["statistic_id"]
    existing = session.execute(
        text("SELECT id FROM statistics_meta WHERE statistic_id = :sid"), {"sid": sid}
    ).first()
    if existing and not merge:
        raise ValueError(f"{sid} already exists; delete it first or restore with merge")

    if existing:
        mid = existing.id
    else:
        _insert(session, "statistics_meta", [data["meta"]])
        mid = session.execute(
            text("SELECT id FROM statistics_meta WHERE statistic_id = :sid"), {"sid": sid}
        ).scalar()

    out: dict[str, Any] = {"statistic_id": sid, "metadata_id": mid, "merged": bool(existing)}
    for table in ("statistics", "statistics_short_term"):
        key = "short_term" if table.endswith("short_term") else table
        rows = data.get(table, [])
        have: set[Any] = set()
        if existing:
            have = {
                r[0]
                for r in session.execute(
                    text(f"SELECT start_ts FROM {table} WHERE metadata_id = :m"),  # noqa: S608
                    {"m": mid},
                )
            }
        todo = [{**r, "metadata_id": mid} for r in rows if r.get("start_ts") not in have]
        _insert(session, table, todo)
        out[key] = len(todo)
        out[f"{key}_skipped"] = len(rows) - len(todo)
    return out
