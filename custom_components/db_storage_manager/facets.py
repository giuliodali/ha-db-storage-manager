"""Facet counting and cross-filtering for the Entities view. No Home Assistant imports."""

from __future__ import annotations

from typing import Any

FACETS = ("suggestion", "used_in", "integration", "device", "domain", "defined_in", "retention", "status", "age")
AGE_ORDER = ("This week", "1 to 6 months", "6+ months", "No data")
SUGGESTION_ORDER = ("Remove history", "Disable", "Remove from YAML", "Review", "Keep")
WEEK = 7 * 86400
SIX_MONTHS = 183 * 86400


def age_bucket(last_ts: float | None, now: float) -> str:
    if last_ts is None:
        return "No data"
    age = now - last_ts
    if age < WEEK:
        return "This week"
    if age < SIX_MONTHS:
        return "1 to 6 months"
    return "6+ months"


def _matches(item: dict[str, Any], filters: dict[str, list[str]], skip: str | None) -> bool:
    for facet, values in filters.items():
        if facet == skip or not values:
            continue
        have = item.get(facet)
        if isinstance(have, list):
            if not set(have) & set(values):
                return False
        elif have not in values:
            return False
    return True


def build_facets(
    items: list[dict[str, Any]],
    filters: dict[str, list[str]] | None = None,
    top: int = 8,
    size_key: str = "total_bytes",
    expand: list[str] | None = None,
) -> dict[str, list[dict[str, Any]]]:
    """Bytes per facet value, each facet filtered by all the *other* facets.

    That is how faceted search normally behaves: ticking "cover" under Type leaves
    the Type list intact but redraws Integration, Device, Status and Age.
    """
    filters = filters or {}
    out: dict[str, list[dict[str, Any]]] = {}

    def values(it: dict[str, Any], facet: str) -> list[str]:
        raw = it.get(facet)
        return list(raw) if isinstance(raw, list) else [raw or "Unknown"]

    for facet in FACETS:
        # Rank values by their size across *all* items so the list never reshuffles when a
        # box is ticked; only the numbers shown next to each value follow the other filters.
        overall: dict[str, float] = {}
        for it in items:
            for v in values(it, facet):
                overall[v] = overall.get(v, 0.0) + it.get(size_key, 0)
        if facet == "suggestion":
            order = sorted(overall, key=lambda v: SUGGESTION_ORDER.index(v) if v in SUGGESTION_ORDER else 99)
        elif facet == "age":
            order = sorted(overall, key=lambda v: AGE_ORDER.index(v) if v in AGE_ORDER else 99)
        else:
            order = sorted(overall, key=lambda v: overall[v], reverse=True)

        totals: dict[str, dict[str, float]] = {v: {"bytes": 0.0, "count": 0} for v in order}
        for it in items:
            if not _matches(it, filters, facet):
                continue
            for v in values(it, facet):
                totals[v]["bytes"] += it.get(size_key, 0)
                totals[v]["count"] += 1

        def row(v: str) -> dict[str, Any]:
            return {"value": v, "bytes": round(totals[v]["bytes"]), "count": int(totals[v]["count"])}

        if facet in ("suggestion", "age"):
            out[facet] = [row(v) for v in order]
            continue
        ticked = set(filters.get(facet, []))
        head = order if expand and facet in expand else order[:top] + [v for v in order[top:] if v in ticked]
        rest = [v for v in order if v not in head]
        rows = [row(v) for v in head]
        if rest:
            rows.append({"value": f"{len(rest)} more", "bytes": sum(round(totals[v]["bytes"]) for v in rest),
                         "count": sum(int(totals[v]["count"]) for v in rest), "other": True})
        out[facet] = rows
    return out


def apply_filters(
    items: list[dict[str, Any]], filters: dict[str, list[str]] | None, search: str = "", size_key: str = "total_bytes"
) -> list[dict[str, Any]]:
    filters = filters or {}
    needle = search.strip().lower()
    return sorted(
        (
            it for it in items
            if _matches(it, filters, None)
            and (not needle or needle in it["entity_id"].lower() or needle in str(it.get("name", "")).lower())
        ),
        key=lambda it: it.get(size_key, 0),
        reverse=True,
    )
