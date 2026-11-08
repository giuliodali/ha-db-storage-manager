"""Read-only size queries. No Home Assistant imports so they test standalone."""

from __future__ import annotations

import json
import time
from typing import Any

from sqlalchemy import text

RECORDER_TABLES = (
    "states",
    "state_attributes",
    "states_meta",
    "events",
    "event_data",
    "event_types",
    "statistics",
    "statistics_short_term",
    "statistics_meta",
)

_TABLE_BYTES_SQL = text(
    """
    SELECT m.tbl_name AS tbl, SUM(d.pgsize) AS bytes
    FROM dbstat d JOIN sqlite_master m ON d.name = m.name
    GROUP BY m.tbl_name ORDER BY bytes DESC
    """
)

_PAGES_SQL = text(
    """
    SELECT (SELECT page_count FROM pragma_page_count) AS page_count,
           (SELECT freelist_count FROM pragma_freelist_count) AS freelist_count,
           (SELECT page_size FROM pragma_page_size) AS page_size
    """
)


def page_stats(session) -> dict[str, int] | None:
    """Page counts for SQLite, or None on other databases."""
    if dialect_name(session) != "sqlite":
        return None
    p = session.execute(_PAGES_SQL).one()
    return {
        "page_size": int(p.page_size),
        "page_count": int(p.page_count),
        "freelist_count": int(p.freelist_count),
        "total_bytes": int(p.page_count) * int(p.page_size),
        "free_bytes": int(p.freelist_count) * int(p.page_size),
    }


def statistics_bytes(session) -> int | None:
    """On-disk bytes of the long-term statistics tables (SQLite only)."""
    if dialect_name(session) != "sqlite":
        return None
    row = session.execute(text(
        "SELECT SUM(d.pgsize) FROM dbstat d JOIN sqlite_master m ON d.name = m.name "
        "WHERE m.tbl_name IN ('statistics', 'statistics_short_term', 'statistics_meta')")).scalar()
    return int(row or 0)


def dialect_name(session) -> str:
    return session.get_bind().dialect.name


def table_sizes(session, with_rows: bool = True) -> dict[str, Any]:
    """True on-disk bytes per table (indexes included) on SQLite.

    Other databases return estimates only, flagged by ``exact: False``.
    """
    timings: dict[str, float] = {}
    dialect = dialect_name(session)
    out: dict[str, Any] = {"dialect": dialect, "exact": dialect == "sqlite"}

    if dialect == "sqlite":
        t = time.monotonic()
        rows = session.execute(_TABLE_BYTES_SQL).all()
        timings["dbstat_ms"] = round((time.monotonic() - t) * 1000, 1)
        out["tables"] = [{"table": r.tbl, "bytes": int(r.bytes or 0)} for r in rows]

        t = time.monotonic()
        p = session.execute(_PAGES_SQL).one()
        timings["pages_ms"] = round((time.monotonic() - t) * 1000, 1)
        out["page_size"] = int(p.page_size)
        out["page_count"] = int(p.page_count)
        out["freelist_count"] = int(p.freelist_count)
        out["free_bytes"] = int(p.freelist_count) * int(p.page_size)
        out["total_bytes"] = int(p.page_count) * int(p.page_size)
    else:
        out["tables"] = [{"table": name, "bytes": None} for name in RECORDER_TABLES]

    if with_rows:
        t = time.monotonic()
        counts = {}
        for entry in out["tables"]:
            name = entry["table"]
            if name in RECORDER_TABLES:  # allow-list: names are interpolated
                counts[name] = session.execute(text(f"SELECT COUNT(*) FROM {name}")).scalar()
        for entry in out["tables"]:
            entry["rows"] = counts.get(entry["table"])
        timings["row_counts_ms"] = round((time.monotonic() - t) * 1000, 1)

    out["timings_ms"] = timings
    return out


def statistics_counts(session, statistic_id: str) -> dict[str, Any]:
    """Row counts for one statistic across long-term and short-term tables."""
    meta = session.execute(
        text("SELECT id FROM statistics_meta WHERE statistic_id = :sid"),
        {"sid": statistic_id},
    ).first()
    if meta is None:
        return {"statistic_id": statistic_id, "exists": False, "statistics": 0, "short_term": 0}
    mid = meta.id
    return {
        "statistic_id": statistic_id,
        "exists": True,
        "statistics": session.execute(
            text("SELECT COUNT(*) FROM statistics WHERE metadata_id = :m"), {"m": mid}
        ).scalar(),
        "short_term": session.execute(
            text("SELECT COUNT(*) FROM statistics_short_term WHERE metadata_id = :m"),
            {"m": mid},
        ).scalar(),
    }


# --- raw rows for the inspector ------------------------------------------------

_ROW_KINDS = {"states": None, "statistics": "statistics", "short_term": "statistics_short_term"}
_MAX_VALUE_CHARS = 400


_MAX_ITEMS = 60
_MAX_DEPTH = 8


def _clip(value: Any, depth: int = 0) -> Any:
    """Keep very long attribute values from flooding the panel, but stay structured.

    Lists and objects stay lists and objects (the panel draws them as collapsible JSON); only long
    strings are cut, long collections are shortened with a note, and text that is itself JSON is parsed.
    """
    if isinstance(value, str):
        stripped = value.strip()
        if depth < 2 and stripped[:1] in "{[" and len(stripped) < 200_000:
            try:
                parsed = json.loads(stripped)
            except ValueError:
                parsed = None
            if isinstance(parsed, (dict, list)):
                return _clip(parsed, depth + 1)
        if len(value) > _MAX_VALUE_CHARS:
            return value[:_MAX_VALUE_CHARS] + f"... ({len(value):,} characters)"
        return value
    if depth >= _MAX_DEPTH and isinstance(value, (list, dict)):
        return f"... ({len(json.dumps(value, default=str)):,} characters)"
    if isinstance(value, list):
        out = [_clip(v, depth + 1) for v in value[:_MAX_ITEMS]]
        if len(value) > _MAX_ITEMS:
            out.append(f"... {len(value) - _MAX_ITEMS:,} more items")
        return out
    if isinstance(value, dict):
        items = list(value.items())
        out_d = {str(k): _clip(v, depth + 1) for k, v in items[:_MAX_ITEMS]}
        if len(items) > _MAX_ITEMS:
            out_d["..."] = f"{len(items) - _MAX_ITEMS:,} more keys"
        return out_d
    return value


def entity_rows(session, entity_id: str, kind: str = "states", limit: int = 25,
                cursor: list[float] | None = None) -> dict[str, Any]:
    """One page of what the recorder stored for an entity, newest first.

    ``kind`` is "states" (state plus its attributes), "statistics" (hourly long-term) or
    "short_term" (5-minute). Pages use a cursor (the last row's time and id) instead of an
    offset, so deep pages stay fast on a large table. ``total`` is only counted on page one.
    """
    if kind not in _ROW_KINDS:
        raise ValueError("unknown kind")
    limit = max(1, min(int(limit), 200))
    params: dict[str, Any] = {"eid": entity_id, "n": limit + 1}
    if kind == "states":
        where = "m.entity_id = :eid"
        if cursor:
            where += " AND (s.last_updated_ts < :ts OR (s.last_updated_ts = :ts AND s.state_id < :id))"
            params.update(ts=cursor[0], id=cursor[1])
        sql = (
            "SELECT s.*, a.shared_attrs AS shared_attrs FROM states s "
            "JOIN states_meta m ON m.metadata_id = s.metadata_id "
            "LEFT JOIN state_attributes a ON a.attributes_id = s.attributes_id "
            f"WHERE {where} ORDER BY s.last_updated_ts DESC, s.state_id DESC LIMIT :n"
        )
        count_sql = "SELECT COUNT(*) FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id WHERE m.entity_id = :eid"
    else:
        table = _ROW_KINDS[kind]
        where = "m.statistic_id = :eid"
        if cursor:
            where += " AND (t.start_ts < :ts OR (t.start_ts = :ts AND t.id < :id))"
            params.update(ts=cursor[0], id=cursor[1])
        sql = (
            f"SELECT t.* FROM {table} t JOIN statistics_meta m ON m.id = t.metadata_id "
            f"WHERE {where} ORDER BY t.start_ts DESC, t.id DESC LIMIT :n"
        )
        count_sql = f"SELECT COUNT(*) FROM {table} t JOIN statistics_meta m ON m.id = t.metadata_id WHERE m.statistic_id = :eid"

    raw = [dict(r) for r in session.execute(text(sql), params).mappings()]
    more = len(raw) > limit
    raw = raw[:limit]
    rows: list[dict[str, Any]] = []
    for r in raw:
        if kind == "states":
            attrs: dict[str, Any] = {}
            attr_bytes = len(r["shared_attrs"] or "")
            try:
                loaded = json.loads(r["shared_attrs"] or "{}")
                attrs = {k: _clip(v) for k, v in loaded.items()} if isinstance(loaded, dict) else {}
            except ValueError:
                attrs = {"(unreadable attributes)": True}
            ts = r.get("last_updated_ts")
            rows.append({
                "id": r["state_id"], "ts": ts, "changed_ts": r.get("last_changed_ts") or ts,
                "state": r["state"], "attributes": attrs, "attr_bytes": attr_bytes,
            })
        else:
            rows.append({"id": r["id"], "ts": r["start_ts"],
                         **{k: r.get(k) for k in ("mean", "min", "max", "state", "sum") if k in r}})
    nxt = [rows[-1]["ts"], rows[-1]["id"]] if more and rows else None
    total = session.execute(text(count_sql), {"eid": entity_id}).scalar() if not cursor else None
    return {"rows": rows, "next": nxt, "total": total, "kind": kind}


def states_older_than(session, entity_ids: list[str], cutoff_ts: float) -> dict[str, int]:
    """How many state rows of each entity are older than the cutoff."""
    if not entity_ids:
        return {}
    marks = ",".join(f":e{i}" for i in range(len(entity_ids)))
    params = {f"e{i}": e for i, e in enumerate(entity_ids)} | {"cut": cutoff_ts}
    rows = session.execute(text(
        f"SELECT m.entity_id AS e, COUNT(*) AS n FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id "  # noqa: S608
        f"WHERE m.entity_id IN ({marks}) AND s.last_updated_ts < :cut GROUP BY m.entity_id"), params)
    return {r.e: int(r.n) for r in rows}
