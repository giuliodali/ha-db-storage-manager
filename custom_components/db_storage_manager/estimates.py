"""Per-entity size estimates reconciled to true table sizes. No Home Assistant imports.

SQLite cannot say how many bytes one entity uses, so each entity gets a weight
(payload length plus a fixed per-row overhead) and the weights are scaled so
that they sum exactly to the table's true on-disk bytes from dbstat. Rankings
are therefore reliable and totals always add up; individual figures are estimates.
"""

from __future__ import annotations

import time
from typing import Any

from sqlalchemy import text

ROW_OVERHEAD = 40  # bytes of row/index overhead added to each state row's payload

_STATES_SQL = text(
    """
    SELECT sm.entity_id AS entity_id, COUNT(*) AS n_rows,
           SUM(LENGTH(COALESCE(s.state, '')) + :ovh) AS weight,
           MAX(s.last_updated_ts) AS last_ts
    FROM states s JOIN states_meta sm ON sm.metadata_id = s.metadata_id
    GROUP BY sm.entity_id
    """
)

# Attributes are stored once per distinct payload, so count each distinct row once.
_ATTRS_SQL = text(
    """
    SELECT sm.entity_id AS entity_id, SUM(LENGTH(COALESCE(sa.shared_attrs, ''))) AS weight
    FROM (SELECT DISTINCT metadata_id, attributes_id FROM states) d
    JOIN states_meta sm ON sm.metadata_id = d.metadata_id
    JOIN state_attributes sa ON sa.attributes_id = d.attributes_id
    GROUP BY sm.entity_id
    """
)

_STATS_SQL = {
    "statistics": text(
        "SELECT m.statistic_id AS sid, COUNT(*) AS n_rows, MAX(s.start_ts) AS last_ts "
        "FROM statistics s JOIN statistics_meta m ON m.id = s.metadata_id GROUP BY m.statistic_id"
    ),
    "statistics_short_term": text(
        "SELECT m.statistic_id AS sid, COUNT(*) AS n_rows, MAX(s.start_ts) AS last_ts "
        "FROM statistics_short_term s JOIN statistics_meta m ON m.id = s.metadata_id "
        "GROUP BY m.statistic_id"
    ),
}


def _scale(weights: dict[str, float], total_bytes: float) -> dict[str, float]:
    total = sum(weights.values())
    if total <= 0 or not total_bytes:
        return {k: 0.0 for k in weights}
    return {k: v / total * total_bytes for k, v in weights.items()}


def query_entities(session, progress=None, only: set[str] | None = None) -> dict[str, dict[str, Any]]:
    """Read the raw per-entity weights and row counts, for every entity or only the ``only`` ids.

    The weights are what the sizes are scaled from, and they are kept with each entity so a later
    partial scan can rescale everything without re-reading the entities it leaves alone.
    """
    ents: dict[str, dict[str, Any]] = {}
    keep = (lambda eid: True) if only is None else (lambda eid: eid in only)

    def entry(eid: str) -> dict[str, Any]:
        return ents.setdefault(
            eid,
            {"entity_id": eid, "states_rows": 0, "states_w": 0.0, "attrs_w": 0.0,
             "stats_rows": 0, "short_rows": 0, "last_ts": None},
        )

    def bump_ts(e: dict[str, Any], ts: float | None) -> None:
        if ts is not None and (e["last_ts"] is None or ts > e["last_ts"]):
            e["last_ts"] = ts

    progress and progress("states")
    for r in session.execute(_STATES_SQL, {"ovh": ROW_OVERHEAD}):
        if keep(r.entity_id):
            e = entry(r.entity_id)
            e["states_rows"], e["states_w"] = r.n_rows, float(r.weight or 0)
            bump_ts(e, r.last_ts)
    progress and progress("attributes")
    for r in session.execute(_ATTRS_SQL):
        if keep(r.entity_id):
            entry(r.entity_id)["attrs_w"] = float(r.weight or 0)
    progress and progress("statistics")
    for table, key in (("statistics", "stats_rows"), ("statistics_short_term", "short_rows")):
        for r in session.execute(_STATS_SQL[table]):
            if keep(r.sid):
                e = entry(r.sid)
                e[key] = r.n_rows
                bump_ts(e, r.last_ts)
    return ents


def scale_entities(ents: dict[str, dict[str, Any]], table_bytes: dict[str, int]) -> None:
    """Fill in states_bytes, attrs_bytes, stats_bytes and total_bytes so each table's shares add up to its true size."""
    states_total = (table_bytes.get("states") or 0) + (table_bytes.get("states_meta") or 0)
    for key, out, total in (("states_w", "states_bytes", states_total), ("attrs_w", "attrs_bytes", table_bytes.get("state_attributes") or 0)):
        for eid, b in _scale({k: e[key] for k, e in ents.items()}, total).items():
            ents[eid][out] = b
    for e in ents.values():
        e["stats_bytes"] = 0.0
    for table, key in (("statistics", "stats_rows"), ("statistics_short_term", "short_rows")):
        for eid, b in _scale({k: float(e[key]) for k, e in ents.items() if e[key]}, table_bytes.get(table) or 0).items():
            ents[eid]["stats_bytes"] += b
    for e in ents.values():
        e["total_bytes"] = e["states_bytes"] + e["attrs_bytes"] + e["stats_bytes"]


def entity_estimates(session, table_bytes: dict[str, int], progress=None) -> dict[str, Any]:
    """Return {"entities": {id: metrics}, "timings_ms": {...}}.

    ``table_bytes`` maps table name to true bytes (from queries.table_sizes).
    """
    t = time.monotonic()
    ents = query_entities(session, progress)
    scale_entities(ents, table_bytes)
    return {"entities": ents, "timings_ms": {"entities_ms": round((time.monotonic() - t) * 1000, 1)}}


def known_ids(session) -> set[str]:
    """Every entity or statistic id that has data in the database (two tiny queries on the meta tables)."""
    ids = {r[0] for r in session.execute(text("SELECT entity_id FROM states_meta WHERE entity_id IS NOT NULL"))}
    ids |= {r[0] for r in session.execute(text("SELECT statistic_id FROM statistics_meta"))}
    return ids


def partial_estimates(session, table_bytes: dict[str, int], previous: dict[str, dict[str, Any]], targets: set[str],
                      progress=None) -> dict[str, Any] | None:
    """Refresh only ``targets`` (plus any id the database has that ``previous`` lacks), keeping the rest.

    Returns None when the previous scan did not keep its weights (it came from an older version), so
    the caller does a full scan instead. The unchanged entities are rescaled from their stored
    weights, so the totals still add up to the true table sizes.
    """
    t = time.monotonic()
    if any("states_w" not in e for e in previous.values()):
        return None
    new = known_ids(session) - set(previous)
    redo = set(targets) | new
    fresh = query_entities(session, progress, redo)
    ents = {eid: dict(e) for eid, e in previous.items() if eid not in redo}
    ents.update(fresh)
    scale_entities(ents, table_bytes)
    return {"entities": ents, "refreshed": len(redo), "new": len(new),
            "timings_ms": {"entities_ms": round((time.monotonic() - t) * 1000, 1)}}


_WIN_STATES_SQL = """
SELECT sm.entity_id AS entity_id, COUNT(*) AS n
FROM states s JOIN states_meta sm ON sm.metadata_id = s.metadata_id
WHERE s.last_updated_ts >= :a AND s.last_updated_ts < :b
GROUP BY sm.entity_id
"""

_WIN_STATS_SQL = """
SELECT m.statistic_id AS entity_id, COUNT(*) AS n
FROM {table} t JOIN statistics_meta m ON m.id = t.metadata_id
WHERE t.start_ts >= :a AND t.start_ts < :b
GROUP BY m.statistic_id
"""


def window_activity(session, start_ts: float, end_ts: float) -> dict[str, Any]:
    """Rows each entity wrote between two timestamps (states and statistics).

    Returns {"rows": {entity_id: {"states": n, "stats": n}}, "ms": ...}. Counting rows by
    time uses the recorder's own timestamp indexes, so it stays cheap next to the full scan.
    """
    t0 = time.monotonic()
    params = {"a": float(start_ts), "b": float(end_ts)}
    rows: dict[str, dict[str, int]] = {}
    for r in session.execute(text(_WIN_STATES_SQL), params):
        rows.setdefault(r.entity_id, {"states": 0, "stats": 0})["states"] = int(r.n)
    for table in ("statistics", "statistics_short_term"):
        for r in session.execute(text(_WIN_STATS_SQL.format(table=table)), params):
            rows.setdefault(r.entity_id, {"states": 0, "stats": 0})["stats"] += int(r.n)
    return {"rows": rows, "ms": round((time.monotonic() - t0) * 1000, 1)}


def apply_window(items: list[dict[str, Any]], activity: dict[str, dict[str, int]]) -> list[dict[str, Any]]:
    """Copy of the items that wrote data in the window, with an estimated size for that period.

    The estimate scales each entity's measured bytes by the share of its rows that fall
    in the window, so it tracks the full scan's numbers rather than inventing new ones.
    """
    out = []
    for it in items:
        act = activity.get(it["entity_id"])
        if not act:
            continue
        s_total = it.get("states_rows") or 0
        st_total = (it.get("stats_rows") or 0) + (it.get("short_rows") or 0)
        win = (it.get("states_bytes", 0) + it.get("attrs_bytes", 0)) * (act["states"] / s_total) if s_total else 0.0
        win += it.get("stats_bytes", 0) * (act["stats"] / st_total) if st_total else 0.0
        if not win and (act["states"] or act["stats"]):
            win = (act["states"] + act["stats"]) * ROW_OVERHEAD
        out.append({**it, "win_rows": act["states"] + act["stats"], "win_states": act["states"],
                    "win_stats": act["stats"], "win_bytes": round(win)})
    return out
