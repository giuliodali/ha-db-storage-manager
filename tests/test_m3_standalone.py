"""M3: suggestions and period activity. No Home Assistant needed."""

from __future__ import annotations

import time

from tests.test_m1_standalone import _item, _load, estimates, facets, session  # noqa: F401

candidates = _load("candidates")


def _c(**kw):
    base = {"status": "Active", "used_count": 0, "dynamic_possible": 0, "age": "This week"}
    return candidates.classify({**base, **kw})


def test_orphaned_and_disabled_are_remove_history():
    assert _c(status="Orphaned")["suggestion"] == "Remove history"
    assert _c(status="Orphaned")["confidence"] == "High"
    d = _c(status="Disabled", used_count=2)
    assert d["suggestion"] == "Remove history" and d["confidence"] == "Medium"
    assert any("2 references" in r for r in d["reasons"])


def test_active_rules():
    assert _c(used_count=3)["suggestion"] == "Keep"
    assert _c(used_count=3, age="6+ months")["suggestion"] == "Review"
    assert _c()["suggestion"] == "Review"                       # unreferenced but still updating
    assert _c(age="6+ months")["suggestion"] == "Disable"       # unreferenced and stale
    dyn = _c(dynamic_possible=2)
    assert dyn["suggestion"] == "Review" and dyn["confidence"] == "Low"
    assert _c(status="External")["suggestion"] == "Keep"


def test_suggestion_facet_order_and_size_key():
    items = [
        {**_item("sensor.a", "x", "d", "sensor", "Active", "This week", 100), "suggestion": "Keep", "win_bytes": 5},
        {**_item("sensor.b", "x", "d", "sensor", "Orphaned", "6+ months", 50), "suggestion": "Remove history", "win_bytes": 900},
    ]
    f = facets.build_facets(items)
    assert [r["value"] for r in f["suggestion"]] == ["Remove history", "Keep"]
    w = facets.build_facets(items, size_key="win_bytes")
    assert {r["value"]: r["bytes"] for r in w["suggestion"]} == {"Remove history": 900, "Keep": 5}
    ranked = facets.apply_filters(items, {}, "", size_key="win_bytes")
    assert ranked[0]["entity_id"] == "sensor.b"


def test_window_activity_counts_rows_in_period(session):  # noqa: F811
    now = time.time()
    act = estimates.window_activity(session, now - 7200, now)
    rows = act["rows"]
    assert rows["sensor.chatty"]["states"] == 2000
    assert rows["sensor.big_attrs"]["states"] == 50
    assert "cover.quiet" not in rows                              # its rows are 300 days old
    assert rows["sensor.chatty"]["stats"] > 0
    assert "sensor.ghost" in rows                                 # statistics-only entity
    old = estimates.window_activity(session, now - 301 * 86400, now - 299 * 86400)["rows"]
    assert list(old) == ["cover.quiet"] and old["cover.quiet"]["states"] == 10


def test_apply_window_scales_bytes_by_share(session):  # noqa: F811
    now = time.time()
    tb = {"states": 1_000_000, "state_attributes": 200_000, "statistics": 100_000, "statistics_short_term": 10_000}
    est = estimates.entity_estimates(session, tb)
    items = [{"entity_id": k, **v} for k, v in est["entities"].items()]
    act = estimates.window_activity(session, now - 7200, now)["rows"]
    win = {i["entity_id"]: i for i in estimates.apply_window(items, act)}
    whole = {i["entity_id"]: i for i in items}
    # Everything the entity wrote is inside the window, so the window size equals its full size.
    assert abs(win["sensor.big_attrs"]["win_bytes"] - whole["sensor.big_attrs"]["states_bytes"] - whole["sensor.big_attrs"]["attrs_bytes"]) <= 1
    assert "cover.quiet" not in win
    # A statistics-only entity still gets a non-zero estimate.
    assert win["sensor.ghost"]["win_bytes"] > 0


def test_entity_rows_pages_with_cursor(session):  # noqa: F811
    q = __import__("sys").modules["queries"]
    first = q.entity_rows(session, "sensor.chatty", "states", limit=500)   # capped at 200 per page
    assert first["total"] == 2000 and len(first["rows"]) == 200 and first["next"] is not None
    seen = {r["id"] for r in first["rows"]}
    cur, pages = first["next"], 1
    while cur:
        page = q.entity_rows(session, "sensor.chatty", "states", limit=200, cursor=cur)
        assert page["total"] is None                      # counted once, on page one
        ids = {r["id"] for r in page["rows"]}
        assert not ids & seen                             # no row repeats across pages
        seen |= ids
        cur, pages = page["next"], pages + 1
    assert len(seen) == 2000 and pages == 10   # every row has the same timestamp: the id breaks ties


def test_entity_rows_attributes_and_statistics(session):  # noqa: F811
    q = __import__("sys").modules["queries"]
    big = q.entity_rows(session, "sensor.big_attrs", "states", limit=3)
    assert big["rows"][0]["attr_bytes"] == 5000 and big["rows"][0]["state"] == "on"
    # attributes that are not a JSON object degrade to a marker instead of failing
    assert big["rows"][0]["attributes"] == {"(unreadable attributes)": True}
    st = q.entity_rows(session, "sensor.chatty", "statistics", limit=10)
    assert st["total"] == 400 and len(st["rows"]) == 10 and st["rows"][0]["ts"] > st["rows"][1]["ts"]
    assert "mean" in st["rows"][0]
    short = q.entity_rows(session, "sensor.chatty", "short_term", limit=100)
    assert short["total"] == 30 and short["next"] is None
    assert q.entity_rows(session, "sensor.nope", "states")["rows"] == []
    import pytest
    with pytest.raises(ValueError):
        q.entity_rows(session, "sensor.chatty", "bogus")


def test_entity_rows_clips_long_values():
    q = __import__("sys").modules["queries"]
    assert q._clip("x" * 1000).endswith("(1,000 characters)")
    assert q._clip({"a": "y" * 1000})["a"].endswith("(1,000 characters)")     # stays an object, only the long text is cut
    assert q._clip('{"a": [1, 2]}') == {"a": [1, 2]}                          # JSON held in a string is parsed
    assert q._clip(list(range(100)))[-1] == "... 40 more items"
    assert q._clip(5) == 5


def test_dead_entities_are_not_kept():
    dead = _c(unavailable=True, age="1 to 6 months", used_count=0)
    assert dead["suggestion"] == "Disable" and "Disable + clear" in " ".join(dead["reasons"])
    gone = _c(unavailable=True, provider_gone=True, age="6+ months", dynamic_possible=3)
    assert gone["suggestion"] == "Disable" and gone["confidence"] == "High"
    referenced = _c(unavailable=True, age="1 to 6 months", used_count=2)
    assert referenced["suggestion"] == "Review"                 # was "Keep": the references see a dead entity
    assert _c(unavailable=True, age="This week", used_count=2)["suggestion"] == "Keep"   # a brief outage is not dead


def test_external_statistics_that_stopped_updating():
    old = _c(status="External", age="1 to 6 months")
    assert old["suggestion"] == "Remove history" and any("cannot be disabled" in r for r in old["reasons"])
    assert _c(status="External", age="1 to 6 months", used_count=1)["suggestion"] == "Review"
    assert _c(status="External", age="This week")["suggestion"] == "Keep"


def test_yaml_defined_entities():
    gone = _c(age="6+ months", defined_in="YAML (no unique ID)")
    assert gone["suggestion"] == "Remove from YAML" and any("YAML" in r for r in gone["reasons"])
    assert _c(age="6+ months", defined_in="YAML")["suggestion"] == "Disable"
    assert any("YAML" in r for r in _c(age="6+ months", defined_in="YAML")["reasons"])
    assert _c(age="6+ months", defined_in="YAML (no unique ID)", used_count=2)["suggestion"] != "Remove from YAML"


def test_facet_other_row_can_be_expanded():
    items = [_item(f"sensor.s{i}", f"int{i}", "d", "sensor", "Active", "This week", 100 - i) for i in range(12)]
    collapsed = facets.build_facets(items)["integration"]
    assert collapsed[-1]["other"] and collapsed[-1]["value"] == "4 more"
    full = facets.build_facets(items, expand=["integration"])["integration"]
    assert len(full) == 12 and not any(r.get("other") for r in full)
