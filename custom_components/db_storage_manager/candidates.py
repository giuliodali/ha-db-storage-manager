"""Cleanup suggestions per entity. No Home Assistant imports.

A suggestion is advice, not a verdict: the usage scan reads text and cannot see dynamic
references, so "Not referenced" is never treated as proof that something is unused.
"""

from __future__ import annotations

from typing import Any

SUGGESTIONS = ("Remove history", "Disable", "Remove from YAML", "Review", "Keep")


def classify(item: dict[str, Any]) -> dict[str, Any]:
    """Return {"suggestion", "confidence", "reasons"} for one inventory item."""
    r = _classify(item)
    where = item.get("defined_in")
    if item.get("status") == "Active" and not item.get("used_count"):
        if where == "YAML (no unique ID)" and r["suggestion"] == "Disable":
            return {"suggestion": "Remove from YAML", "confidence": r["confidence"],
                    "reasons": [*r["reasons"][:-1], "Defined in YAML without a unique_id, so Home Assistant cannot disable it. "
                                "Remove its entry from your YAML configuration to stop it recording."]}
        if where == "YAML" and r["suggestion"] == "Disable":
            r["reasons"].append("Defined in YAML: disabling stops it recording but leaves the entry in your YAML file.")
    return r


def _classify(item: dict[str, Any]) -> dict[str, Any]:
    status = item.get("status")
    used = item.get("used_count", 0)
    dynamic = item.get("dynamic_possible", 0)
    stale = item.get("age") == "6+ months"
    # Dead = the entity reports unavailable and has not produced data for over a week, so its
    # history has stopped growing in value. A restored state means the integration no longer provides it.
    dead = bool(item.get("unavailable")) and item.get("age") not in ("This week", None)
    gone = bool(item.get("provider_gone"))
    reasons: list[str] = []

    if status == "External":
        reasons.append("Statistics imported by an integration, not a normal entity, so it cannot be disabled.")
        if item.get("age") in ("1 to 6 months", "6+ months"):
            reasons.append(f"Nothing has been imported for {item.get('age')}.")
            if used:
                reasons.append(f"Still named in {used} reference{'s' if used != 1 else ''} in your config, check those first.")
                return {"suggestion": "Review", "confidence": "Low", "reasons": reasons}
            reasons.append("Not referenced anywhere, so clearing its history is reasonable. It would come back only if the integration starts importing it again.")
            return {"suggestion": "Remove history", "confidence": "Medium", "reasons": reasons}
        return {"suggestion": "Keep", "confidence": "High", "reasons": reasons}

    if status == "Orphaned":
        reasons.append("No entity exists any more; this history is left over.")
        if used:
            reasons.append(f"Still named in {used} reference{'s' if used != 1 else ''} in your config, check those first.")
        return {"suggestion": "Remove history", "confidence": "Medium" if used else "High", "reasons": reasons}

    if status == "Disabled":
        reasons.append("Disabled, so it no longer records new data.")
        if used:
            reasons.append(f"Still named in {used} reference{'s' if used != 1 else ''} in your config.")
        return {"suggestion": "Remove history", "confidence": "Medium" if used else "High", "reasons": reasons}

    # Active entities
    if dead:
        what = "Its integration no longer provides it" if gone else "It is unavailable"
        reasons.append(f"{what} and has not updated for {item.get('age')}.")
        if used:
            reasons.append(f"Still named in {used} reference{'s' if used != 1 else ''} in your config, but those only see an unavailable entity. Check them first.")
            return {"suggestion": "Review", "confidence": "Medium", "reasons": reasons}
        reasons.append("Not referenced anywhere. Disable it to stop it appearing as unavailable; use Disable + clear to also remove its history.")
        return {"suggestion": "Disable", "confidence": "High" if gone else "Medium", "reasons": reasons}
    if used:
        reasons.append(f"Used in {used} reference{'s' if used != 1 else ''} in your config.")
        if stale:
            reasons.append("But it has not updated for 6+ months.")
            return {"suggestion": "Review", "confidence": "Low", "reasons": reasons}
        return {"suggestion": "Keep", "confidence": "High", "reasons": reasons}

    reasons.append("Not found in automations, scripts, scenes, dashboards, helpers or YAML.")
    if dynamic:
        reasons.append(f"{dynamic} template{'s' if dynamic != 1 else ''} loop over every entity of this type and may use it.")
        return {"suggestion": "Review", "confidence": "Low", "reasons": reasons}
    if stale:
        reasons.append("It has not updated for 6+ months.")
        return {"suggestion": "Disable", "confidence": "Medium", "reasons": reasons}
    reasons.append("It is still updating, so check whether you use it elsewhere (apps, Node-RED, voice).")
    return {"suggestion": "Review", "confidence": "Medium", "reasons": reasons}
