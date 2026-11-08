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


def entity_estimates(session, table_bytes: dict[str, int], progress=None) -> dict[str, Any]:
    """Return {"entities": {id: metrics}, "timings_ms": {...}}.

    ``table_bytes`` maps table name to true bytes (from queries.table_sizes).
    """
    timings: dict[str, float] = {}
    ents: dict[str, dict[str, Any]] = {}

    def entry(eid: str) -> dict[str, Any]:
        return ents.setdefault(
            eid,
            {
                "entity_id": eid,
                "states_rows": 0, "states_bytes": 0.0, "attrs_bytes": 0.0,
                "stats_rows": 0, "short_rows": 0, "stats_bytes": 0.0,
                "last_ts": None,
            },
        )

    def bump_ts(e: dict[str, Any], ts: float | None) -> None:
        if ts is not None and (e["last_ts"] is None or ts > e["last_ts"]):
            e["last_ts"] = ts

    progress and progress("states")
    t = time.monotonic()
    state_w: dict[str, float] = {}
    for r in session.execute(_STATES_SQL, {"ovh": ROW_OVERHEAD}):
        e = entry(r.entity_id)
        e["states_rows"] = r.n_rows
        state_w[r.entity_id] = float(r.weight or 0)
        bump_ts(e, r.last_ts)
    states_total = (table_bytes.get("states") or 0) + (table_bytes.get("states_meta") or 0)
    for eid, b in _scale(state_w, states_total).items():
        ents[eid]["states_bytes"] = b
    timings["states_ms"] = round((time.monotonic() - t) * 1000, 1)

    progress and progress("attributes")
    t = time.monotonic()
    attr_w = {r.entity_id: float(r.weight or 0) for r in session.execute(_ATTRS_SQL)}
    for eid, b in _scale(attr_w, table_bytes.get("state_attributes") or 0).items():
        entry(eid)["attrs_bytes"] = b
    timings["attributes_ms"] = round((time.monotonic() - t) * 1000, 1)

    progress and progress("statistics")
    t = time.monotonic()
    for table, key in (("statistics", "stats_rows"), ("statistics_short_term", "short_rows")):
        rows = {r.sid: r for r in session.execute(_STATS_SQL[table])}
        counts = {sid: float(r.n_rows) for sid, r in rows.items()}
        scaled = _scale(counts, table_bytes.get(table) or 0)
        for sid, r in rows.items():
            e = entry(sid)
            e[key] = r.n_rows
            e["stats_bytes"] += scaled[sid]
            bump_ts(e, r.last_ts)
    timings["statistics_ms"] = round((time.monotonic() - t) * 1000, 1)

    for e in ents.values():
        e["total_bytes"] = e["states_bytes"] + e["attrs_bytes"] + e["stats_bytes"]
    return {"entities": ents, "timings_ms": timings}


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
