"""Read-only size queries. No Home Assistant imports so they test standalone."""

from __future__ import annotations

import json
import time
from typing import Any

from sqlalchemy import bindparam, text

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

STATS_TABLES = ("statistics", "statistics_short_term", "statistics_meta")
MYSQL_DIALECTS = ("mysql", "mariadb")

_SQLITE_TABLES_SQL = text(
    """
    SELECT m.tbl_name AS tbl, SUM(d.pgsize) AS bytes
    FROM dbstat d JOIN sqlite_master m ON d.name = m.name
    GROUP BY m.tbl_name ORDER BY bytes DESC
    """
)

_SQLITE_PAGES_SQL = text(
    """
    SELECT (SELECT page_count FROM pragma_page_count) AS page_count,
           (SELECT freelist_count FROM pragma_freelist_count) AS freelist_count,
           (SELECT page_size FROM pragma_page_size) AS page_size
    """
)

# Table, its indexes and its TOAST data, for the tables of the schema the recorder uses.
_PG_TABLES_SQL = text(
    """
    SELECT c.relname AS tbl, pg_total_relation_size(c.oid) AS bytes
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = current_schema() AND c.relkind IN ('r', 'p', 'm')
    ORDER BY bytes DESC
    """
)

# data_length and index_length are what the storage engine reports; data_free is space inside the
# tablespace that deleted rows left behind.
_MYSQL_TABLES_SQL = text(
    """
    SELECT table_name AS tbl,
           COALESCE(data_length, 0) + COALESCE(index_length, 0) AS bytes,
           COALESCE(data_free, 0) AS free_bytes
    FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'
    """
)


def dialect_name(session) -> str:
    return session.get_bind().dialect.name


def _is_mysql(dialect: str) -> bool:
    return dialect in MYSQL_DIALECTS


def supported(dialect: str) -> bool:
    return dialect == "sqlite" or dialect == "postgresql" or _is_mysql(dialect)


def exact_sizes(dialect: str) -> bool:
    """SQLite's dbstat and PostgreSQL's size functions are exact; MySQL and MariaDB report engine statistics."""
    return dialect in ("sqlite", "postgresql")


def floor_sql(dialect: str, expr: str) -> str:
    """``expr`` rounded down to a whole number. SQLite's CAST truncates; the others round, so they FLOOR first."""
    if dialect == "sqlite":
        return f"CAST({expr} AS INTEGER)"
    return f"CAST(FLOOR({expr}) AS {'SIGNED' if _is_mysql(dialect) else 'INTEGER'})"


def state_histogram_sql(dialect: str, ids: bool = False):
    """State rows per whole day of age, for all entities or (``ids``) only the named ones."""
    day = floor_sql(dialect, f"(:now - {'s.' if ids else ''}last_updated_ts) / 86400")
    if not ids:
        return text(f"SELECT {day} AS d, COUNT(*) AS n FROM states GROUP BY d")
    return text(
        f"SELECT {day} AS d, COUNT(*) AS n FROM states s "
        "JOIN states_meta sm ON sm.metadata_id = s.metadata_id WHERE sm.entity_id IN :ids GROUP BY d"
    ).bindparams(bindparam("ids", expanding=True))


def stats_histogram_sql(dialect: str):
    """Long-term statistics rows per whole month of age, per statistic."""
    month = floor_sql(dialect, "(:now - start_ts) / :month")
    return text(f"SELECT metadata_id AS mid, {month} AS m, COUNT(*) AS n FROM statistics GROUP BY mid, m")


# The extra derived table lets MySQL/MariaDB accept the LIMIT inside IN (...).
TRIM_STATISTICS_SQL = text(
    "DELETE FROM statistics WHERE id IN (SELECT id FROM (SELECT id FROM statistics "
    "WHERE metadata_id IN :mids AND start_ts < :cut LIMIT :n) AS old)"
).bindparams(bindparam("mids", expanding=True))


def _mysql_tables(session) -> tuple[list[dict[str, Any]], int | None]:
    """Per-table bytes and the free space inside the database, from information_schema."""
    if dialect_name(session) == "mysql":
        try:  # MySQL 8 caches these statistics for a day by default; MariaDB has no such setting
            session.execute(text("SET SESSION information_schema_stats_expiry = 0"))
        except Exception:  # noqa: BLE001 - older servers and MariaDB: use what they report
            pass
    rows = session.execute(_MYSQL_TABLES_SQL).all()
    tables = sorted(({"table": str(r[0]).lower(), "bytes": int(r[1] or 0)} for r in rows),
                    key=lambda t: t["bytes"], reverse=True)
    frees = [int(r[2] or 0) for r in rows]
    # With a shared tablespace every table reports the same free figure, so count it once.
    free = frees[0] if frees and len(set(frees)) == 1 and len(frees) > 1 else sum(frees)
    return tables, free


def _pg_tables(session) -> list[dict[str, Any]]:
    return [{"table": r.tbl, "bytes": int(r.bytes or 0)} for r in session.execute(_PG_TABLES_SQL).all()]


def _sqlite_pages(session) -> dict[str, int]:
    p = session.execute(_SQLITE_PAGES_SQL).one()
    return {
        "page_size": int(p.page_size),
        "page_count": int(p.page_count),
        "freelist_count": int(p.freelist_count),
        "total_bytes": int(p.page_count) * int(p.page_size),
        "free_bytes": int(p.freelist_count) * int(p.page_size),
    }


def page_stats(session) -> dict[str, int | None] | None:
    """Size of the database and the free space inside it, or None when this database can't say.

    ``free_bytes`` is None on PostgreSQL, which has no cheap exact figure for reusable space.
    """
    dialect = dialect_name(session)
    if dialect == "sqlite":
        return _sqlite_pages(session)
    if dialect == "postgresql":
        total = session.execute(text("SELECT pg_database_size(current_database())")).scalar()
        return {"total_bytes": int(total or 0), "free_bytes": None}
    if _is_mysql(dialect):
        tables, free = _mysql_tables(session)
        used = sum(t["bytes"] for t in tables)
        return {"total_bytes": used + (free or 0), "free_bytes": free}
    return None


def statistics_bytes(session) -> int | None:
    """On-disk bytes of the long-term statistics tables, or None when this database can't say."""
    dialect = dialect_name(session)
    if dialect == "sqlite":
        row = session.execute(text(
            "SELECT SUM(d.pgsize) FROM dbstat d JOIN sqlite_master m ON d.name = m.name "
            "WHERE m.tbl_name IN ('statistics', 'statistics_short_term', 'statistics_meta')")).scalar()
        return int(row or 0)
    if dialect == "postgresql":
        return sum(t["bytes"] for t in _pg_tables(session) if t["table"] in STATS_TABLES)
    if _is_mysql(dialect):
        tables, _ = _mysql_tables(session)
        return sum(t["bytes"] for t in tables if t["table"] in STATS_TABLES)
    return None


def table_sizes(session, with_rows: bool = True) -> dict[str, Any]:
    """On-disk bytes per table (indexes included).

    Exact on SQLite and PostgreSQL. MySQL and MariaDB report the storage engine's own statistics
    (``exact: False``). An unsupported database returns the table names without sizes.
    """
    timings: dict[str, float] = {}
    dialect = dialect_name(session)
    out: dict[str, Any] = {"dialect": dialect, "exact": exact_sizes(dialect), "supported": supported(dialect)}

    t = time.monotonic()
    if dialect == "sqlite":
        rows = session.execute(_SQLITE_TABLES_SQL).all()
        timings["dbstat_ms"] = round((time.monotonic() - t) * 1000, 1)
        out["tables"] = [{"table": r.tbl, "bytes": int(r.bytes or 0)} for r in rows]
        t = time.monotonic()
        out.update(_sqlite_pages(session))
        timings["pages_ms"] = round((time.monotonic() - t) * 1000, 1)
    elif dialect == "postgresql":
        out["tables"] = _pg_tables(session)
        timings["sizes_ms"] = round((time.monotonic() - t) * 1000, 1)
        pages = page_stats(session)
        out["total_bytes"] = pages["total_bytes"]
        out["free_bytes"] = None
    elif _is_mysql(dialect):
        tables, free = _mysql_tables(session)
        timings["sizes_ms"] = round((time.monotonic() - t) * 1000, 1)
        out["tables"] = tables
        out["free_bytes"] = free
        out["total_bytes"] = sum(x["bytes"] for x in tables) + (free or 0)
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
