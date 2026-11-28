"""Did disabling something leave its neighbours permanently down? No Home Assistant imports so it tests standalone.

Nothing outside an integration's own code says which of its entities read which others, so this
looks at what happened instead, using the recorded state history on each scan. An entity from the
same integration entry as something that was disabled is blamed only if it was working when the
action ran, has had no working state since, is unavailable now, and went down soon after the action.
An entity that drops out and comes back is a blip and is ignored.
"""

from __future__ import annotations

from typing import Any

BAD_STATES = ("unavailable", "unknown")
MIN_DOWN = 3 * 3600             # down at least this long (so a slow integration or a reload is not blamed)
ATTRIBUTION_WINDOW = 24 * 3600  # and it went down within this long after the action, or it is unrelated
LOOK_BACK_DAYS = 14             # actions older than this are no longer checked


def is_working(state: str | None) -> bool:
    return state is not None and state not in BAD_STATES


def judge(entity_ids: list[str], before: dict[str, str | None], after: dict[str, tuple[int, float | None]],
          live: dict[str, str | None], cut: float, now: float) -> list[dict[str, Any]]:
    """Entities that look permanently broken by the action made at ``cut``.

    before: state each had when the action ran (its last recorded state before it).
    after:  (rows with a working state since, time of the first unavailable/unknown row since).
    live:   state right now.
    """
    out = []
    for eid in entity_ids:
        good, first_bad = after.get(eid, (0, None))
        if (is_working(before.get(eid)) and not is_working(live.get(eid)) and good == 0
                and first_bad is not None and cut <= first_bad <= cut + ATTRIBUTION_WINDOW
                and now - first_bad >= MIN_DOWN):
            out.append({"entity_id": eid, "down_since": first_bad, "after_s": round(first_bad - cut)})
    return sorted(out, key=lambda b: (b["down_since"], b["entity_id"]))


def result(checked: float, siblings: int, broken: list[dict[str, Any]], previous: dict[str, Any] | None = None) -> dict[str, Any]:
    """What is stored on the action. ``notified`` remembers who the user was already told about."""
    return {"checked": checked, "siblings": siblings, "broken": broken,
            "notified": sorted(set((previous or {}).get("notified", [])) | {b["entity_id"] for b in broken})}


def message(action_id: int, summary: str, broken: list[dict[str, Any]], shown: int = 10) -> str:
    names = [b.get("name") or b["entity_id"] for b in broken]
    more = f" and {len(names) - shown} more" if len(names) > shown else ""
    return (f"After \"{summary}\" (action {action_id} in DB Storage), {len(broken)} other "
            f"entit{'y' if len(broken) == 1 else 'ies'} from the same integration "
            f"{'has' if len(broken) == 1 else 'have'} been unavailable or unknown ever since: "
            f"{', '.join(names[:shown])}{more}.\n\n"
            "That may be a coincidence, but an integration can read an entity you disable. "
            "Open DB Storage > History and undo the action to see whether they come back.")
