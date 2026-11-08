"""Batch backup and restore of everything an action clears. No Home Assistant imports.

One compressed file per action ("batch") holds, for every entity in it, its long-term and
5-minute statistics and (when asked) its recorded state history with the attributes those
states point to. The file is newline-delimited JSON and is read and written as a stream, so a
large history never has to fit in memory. Column names come from the live schema, so a file
survives recorder schema changes as long as the columns still exist.

Restoring puts back only rows that are missing (matched on time), so anything recorded since
the clear is kept.
"""

from __future__ import annotations

import base64
import gzip
import json
import time
from pathlib import Path
from typing import Any, Iterator

from sqlalchemy import text

from .snapshot import _insert

BATCH_VERSION = 2
BATCH_SUFFIX = ".ndjson.gz"
_PAGE = 5000
_STAT_TABLES = ("statistics", "statistics_short_term")
_STATE_DROP = ("state_id", "old_state_id", "event_id", "attributes_id", "metadata_id")


def _enc(obj: Any) -> Any:
    if isinstance(obj, (bytes, bytearray, memoryview)):
        return {"__b64__": base64.b64encode(bytes(obj)).decode()}
    return str(obj)


def _dec(obj: dict[str, Any]) -> Any:
    return base64.b64decode(obj["__b64__"]) if len(obj) == 1 and "__b64__" in obj else obj


def _line(fh, rec: dict[str, Any]) -> None:
    fh.write(json.dumps(rec, default=_enc, separators=(",", ":")) + "\n")


def _clean(row: dict[str, Any], drop: tuple[str, ...] = ("id", "metadata_id")) -> dict[str, Any]:
    return {k: v for k, v in row.items() if k not in drop}


def _pages(session, sql: str, params: dict[str, Any], key: str) -> Iterator[list[dict[str, Any]]]:
    """Walk a table in primary-key order, one page at a time (sql must have :last and :n)."""
    last = -1
    while True:
        rows = [dict(r) for r in session.execute(text(sql), {**params, "last": last, "n": _PAGE}).mappings()]
        if not rows:
            return
        yield rows
        last = rows[-1][key]
        if len(rows) < _PAGE:
            return


def export_batch(session, path: Path, statistic_ids: list[str], state_entity_ids: list[str],
                 states_before: float | None = None) -> dict[str, Any]:
    """Write the backup file. Returns per-entity row counts and the file size."""
    counts: dict[str, dict[str, int]] = {}
    path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(path, "wt", encoding="utf-8") as fh:
        _line(fh, {"t": "header", "version": BATCH_VERSION, "created": time.time(),
                   "statistics": statistic_ids, "states": state_entity_ids})
        for sid in statistic_ids:
            meta = session.execute(text("SELECT * FROM statistics_meta WHERE statistic_id = :s"), {"s": sid}).mappings().first()
            c = counts.setdefault(sid, {"statistics": 0, "short_term": 0, "states": 0})
            if meta is None:
                continue
            _line(fh, {"t": "stat_meta", "sid": sid, "meta": _clean(dict(meta), ("id",))})
            for table in _STAT_TABLES:
                key = "short_term" if table.endswith("short_term") else "statistics"
                sql = f"SELECT * FROM {table} WHERE metadata_id = :m AND id > :last ORDER BY id LIMIT :n"  # noqa: S608
                for page in _pages(session, sql, {"m": meta["id"]}, "id"):
                    for r in page:
                        _line(fh, {"t": "stat", "table": table, "sid": sid, "row": _clean(r)})
                    c[key] += len(page)
        for eid in state_entity_ids:
            meta = session.execute(text("SELECT * FROM states_meta WHERE entity_id = :e"), {"e": eid}).mappings().first()
            c = counts.setdefault(eid, {"statistics": 0, "short_term": 0, "states": 0})
            if meta is None:
                continue
            _line(fh, {"t": "state_meta", "entity_id": eid, "meta": _clean(dict(meta), ("metadata_id",))})
            seen: set[int] = set()
            cut = " AND last_updated_ts < :cut" if states_before is not None else ""
            sql = f"SELECT * FROM states WHERE metadata_id = :m AND state_id > :last{cut} ORDER BY state_id LIMIT :n"  # noqa: S608
            extra = {"cut": states_before} if states_before is not None else {}
            for page in _pages(session, sql, {"m": meta["metadata_id"], **extra}, "state_id"):
                fresh = sorted({r["attributes_id"] for r in page if r.get("attributes_id")} - seen)
                if fresh:
                    marks = ",".join(str(int(i)) for i in fresh)  # integers read from our own query
                    for a in session.execute(text(f"SELECT * FROM state_attributes WHERE attributes_id IN ({marks})")).mappings():  # noqa: S608
                        _line(fh, {"t": "attr", "key": a["attributes_id"], "row": _clean(dict(a), ("attributes_id",))})
                    seen.update(fresh)
                for r in page:
                    _line(fh, {"t": "state", "entity_id": eid, "attr": r.get("attributes_id"), "row": _clean(r, _STATE_DROP)})
                c["states"] += len(page)
        _line(fh, {"t": "end"})
    return {"counts": counts, "bytes": path.stat().st_size}


def read_records(path: Path) -> Iterator[dict[str, Any]]:
    with gzip.open(path, "rt", encoding="utf-8") as fh:
        for ln in fh:
            if ln.strip():
                yield json.loads(ln, object_hook=_dec)


def restore_batch(session, path: Path) -> dict[str, Any]:
    """Put a batch back. Rows that already exist (same time) are skipped, never duplicated."""
    result: dict[str, dict[str, int]] = {}
    stat_mid: dict[str, int] = {}
    stat_have: dict[tuple[str, str], set] = {}
    state_mid: dict[str, int] = {}
    state_have: dict[str, set] = {}
    attr_map: dict[int, int] = {}
    pending: dict[tuple, list[dict[str, Any]]] = {}
    complete = False

    def res(eid: str) -> dict[str, int]:
        return result.setdefault(eid, {"statistics": 0, "short_term": 0, "states": 0, "skipped": 0})

    def flush(table: str | None = None) -> None:
        for key in [k for k in pending if table is None or k[0] == table]:
            rows = pending.pop(key)
            _insert(session, key[0], rows)

    def add(table: str, row: dict[str, Any]) -> None:
        buf = pending.setdefault((table,), [])
        buf.append(row)
        if len(buf) >= 2000:
            flush(table)

    for rec in read_records(path):
        t = rec["t"]
        if t == "stat_meta":
            sid = rec["sid"]
            found = session.execute(text("SELECT id FROM statistics_meta WHERE statistic_id = :s"), {"s": sid}).first()
            if found is None:
                _insert(session, "statistics_meta", [rec["meta"]])
                found = session.execute(text("SELECT id FROM statistics_meta WHERE statistic_id = :s"), {"s": sid}).first()
            stat_mid[sid] = found.id
            res(sid)
        elif t == "stat":
            sid, table, row = rec["sid"], rec["table"], rec["row"]
            have = stat_have.get((table, sid))
            if have is None:
                have = stat_have[(table, sid)] = {
                    r[0] for r in session.execute(text(f"SELECT start_ts FROM {table} WHERE metadata_id = :m"), {"m": stat_mid[sid]})}  # noqa: S608
            r = res(sid)
            if row.get("start_ts") in have:
                r["skipped"] += 1
                continue
            have.add(row.get("start_ts"))
            add(table, {**row, "metadata_id": stat_mid[sid]})
            r["short_term" if table.endswith("short_term") else "statistics"] += 1
        elif t == "state_meta":
            eid = rec["entity_id"]
            flush()
            found = session.execute(text("SELECT metadata_id FROM states_meta WHERE entity_id = :e"), {"e": eid}).first()
            if found is None:
                _insert(session, "states_meta", [rec["meta"]])
                found = session.execute(text("SELECT metadata_id FROM states_meta WHERE entity_id = :e"), {"e": eid}).first()
            state_mid[eid] = found.metadata_id
            state_have[eid] = {r[0] for r in session.execute(
                text("SELECT last_updated_ts FROM states WHERE metadata_id = :m"), {"m": found.metadata_id})}
            res(eid)
        elif t == "attr":
            row = rec["row"]
            found = session.execute(
                text("SELECT attributes_id FROM state_attributes WHERE hash = :h AND shared_attrs = :s"),
                {"h": row.get("hash"), "s": row.get("shared_attrs")}).first()
            if found is None:
                _insert(session, "state_attributes", [row])
                found = session.execute(
                    text("SELECT attributes_id FROM state_attributes WHERE hash = :h AND shared_attrs = :s"),
                    {"h": row.get("hash"), "s": row.get("shared_attrs")}).first()
            attr_map[rec["key"]] = found.attributes_id
        elif t == "state":
            eid, row = rec["entity_id"], rec["row"]
            r = res(eid)
            if row.get("last_updated_ts") in state_have[eid]:
                r["skipped"] += 1
                continue
            state_have[eid].add(row.get("last_updated_ts"))
            out = {**row, "metadata_id": state_mid[eid]}
            out["attributes_id"] = attr_map.get(rec.get("attr"))
            add("states", out)
            r["states"] += 1
        elif t == "end":
            complete = True
    flush()
    if not complete:
        raise ValueError("The backup file is incomplete, so nothing was restored")
    return {"entities": result}
