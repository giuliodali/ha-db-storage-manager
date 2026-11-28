"""Facet counting and cross-filtering for the Entities view. No Home Assistant imports."""

from __future__ import annotations

from typing import Any

FACETS = ("suggestion", "used_in", "integration", "device", "domain", "defined_in", "retention", "status", "age")
AGE_ORDER = ("This week", "1 to 6 months", "6+ months", "No data")
SUGGESTION_ORDER = ("Remove history", "Remove orphaned", "Disable", "Remove from YAML", "Review", "Keep")
# Not a place an entity is used: a derived value of the Referenced In facet for entities that are
# disabled while something in the config still names them (those automations, templates and cards
# quietly stop working). Computed when facets are built, so it follows a status change at once.
NOT_REFERENCED = "Not referenced"
DISABLED_REFERENCED = "Disabled but referenced"
PINNED_USED_IN = (NOT_REFERENCED, DISABLED_REFERENCED)
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


def facet_values(item: dict[str, Any], facet: str) -> list[str]:
    """The values an item has under a facet (a list for multi-valued facets such as Referenced In)."""
    raw = item.get(facet)
    vals = list(raw) if isinstance(raw, list) else [raw or "Unknown"]
    if facet == "used_in" and item.get("status") == "Disabled" and vals and vals[0] != NOT_REFERENCED:
        vals.append(DISABLED_REFERENCED)
    return vals


def _matches(item: dict[str, Any], filters: dict[str, list[str]], skip: str | None) -> bool:
    for facet, values in filters.items():
        if facet == skip or not values:
            continue
        if not set(facet_values(item, facet)) & set(values):
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

    for facet in FACETS:
        # Rank values by their size across *all* items so the list never reshuffles when a
        # box is ticked; only the numbers shown next to each value follow the other filters.
        overall: dict[str, float] = {}
        for it in items:
            for v in facet_values(it, facet):
                overall[v] = overall.get(v, 0.0) + it.get(size_key, 0)
        if facet == "used_in":
            for v in PINNED_USED_IN:  # always listed, even at zero, so the warning is there to find
                overall.setdefault(v, 0.0)
        if facet == "suggestion":
            order = sorted(overall, key=lambda v: SUGGESTION_ORDER.index(v) if v in SUGGESTION_ORDER else 99)
        elif facet == "age":
            order = sorted(overall, key=lambda v: AGE_ORDER.index(v) if v in AGE_ORDER else 99)
        else:
            order = sorted(overall, key=lambda v: overall[v], reverse=True)
        if facet == "used_in":
            order = [v for v in PINNED_USED_IN if v in order] + [v for v in order if v not in PINNED_USED_IN]

        totals: dict[str, dict[str, float]] = {v: {"bytes": 0.0, "count": 0} for v in order}
        for it in items:
            if not _matches(it, filters, facet):
                continue
            for v in facet_values(it, facet):
                totals[v]["bytes"] += it.get(size_key, 0)
                totals[v]["count"] += 1

        def row(v: str) -> dict[str, Any]:
            return {"value": v, "bytes": round(totals[v]["bytes"]), "count": int(totals[v]["count"])}

        if facet in ("suggestion", "age"):
            out[facet] = [row(v) for v in order]
            continue
        ticked = set(filters.get(facet, []))
        pinned = set(PINNED_USED_IN) if facet == "used_in" else set()
        head = order if expand and facet in expand else order[:top] + [v for v in order[top:] if v in ticked or v in pinned]
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
