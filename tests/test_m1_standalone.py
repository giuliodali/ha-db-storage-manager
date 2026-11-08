"""M1 pure-Python tests: estimate reconciliation, facets, journal."""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

PKG = Path(__file__).parent.parent / "custom_components" / "db_storage_manager"


def _load(name):
    import importlib.util

    spec = importlib.util.spec_from_file_location(name, PKG / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


queries = _load("queries")
estimates = _load("estimates")
facets = _load("facets")
journal_mod = _load("journal")

SCHEMA = """
CREATE TABLE states_meta (metadata_id INTEGER PRIMARY KEY, entity_id TEXT);
CREATE TABLE state_attributes (attributes_id INTEGER PRIMARY KEY, shared_attrs TEXT);
CREATE TABLE states (state_id INTEGER PRIMARY KEY, state TEXT, metadata_id INTEGER,
  attributes_id INTEGER, last_updated_ts REAL);
CREATE INDEX ix_states_meta ON states (metadata_id, last_updated_ts);
CREATE TABLE statistics_meta (id INTEGER PRIMARY KEY, statistic_id TEXT UNIQUE);
CREATE TABLE statistics (id INTEGER PRIMARY KEY, metadata_id INTEGER, start_ts REAL, mean REAL);
CREATE TABLE statistics_short_term (id INTEGER PRIMARY KEY, metadata_id INTEGER, start_ts REAL, mean REAL);
"""


@pytest.fixture
def session():
    engine = create_engine("sqlite://")
    now = time.time()
    with engine.begin() as c:
        for stmt in SCHEMA.split(";"):
            if stmt.strip():
                c.execute(text(stmt))
        c.execute(text("INSERT INTO states_meta VALUES (1,'sensor.chatty'),(2,'cover.quiet'),(3,'sensor.big_attrs')"))
        c.execute(text("INSERT INTO state_attributes VALUES (1,'{}'),(2,:big)"), {"big": "x" * 5000})
        for i in range(2000):  # chatty: many rows, tiny attrs
            c.execute(text("INSERT INTO states (state, metadata_id, attributes_id, last_updated_ts) VALUES ('12.3',1,1,:t)"), {"t": now - 60})
        for i in range(10):  # quiet: few rows, old
            c.execute(text("INSERT INTO states (state, metadata_id, attributes_id, last_updated_ts) VALUES ('open',2,1,:t)"), {"t": now - 300 * 86400})
        for i in range(50):  # big attrs: shared payload counted once
            c.execute(text("INSERT INTO states (state, metadata_id, attributes_id, last_updated_ts) VALUES ('on',3,2,:t)"), {"t": now - 3600})
        c.execute(text("INSERT INTO statistics_meta VALUES (1,'sensor.chatty'),(2,'sensor.ghost')"))
        for mid, n in ((1, 400), (2, 100)):
            for i in range(n):
                c.execute(text("INSERT INTO statistics (metadata_id, start_ts, mean) VALUES (:m,:t,1)"), {"m": mid, "t": now - i * 3600})
        for i in range(30):
            c.execute(text("INSERT INTO statistics_short_term (metadata_id, start_ts, mean) VALUES (1,:t,1)"), {"t": now - i * 300})
    with Session(engine) as s:
        yield s


def test_estimates_reconcile_to_table_bytes(session):
    scan = queries.table_sizes(session)
    tb = {t["table"]: t["bytes"] for t in scan["tables"]}
    est = estimates.entity_estimates(session, tb)["entities"]

    assert sum(e["states_bytes"] for e in est.values()) == pytest.approx(tb["states"] + tb.get("states_meta", 0))
    assert sum(e["attrs_bytes"] for e in est.values()) == pytest.approx(tb["state_attributes"])
    # long-term + short-term bytes together equal both statistics tables
    assert sum(e["stats_bytes"] for e in est.values()) == pytest.approx(tb["statistics"] + tb["statistics_short_term"])
    # every entity appears, including one that only has statistics
    assert set(est) == {"sensor.chatty", "cover.quiet", "sensor.big_attrs", "sensor.ghost"}
    assert est["sensor.ghost"]["states_rows"] == 0 and est["sensor.ghost"]["stats_bytes"] > 0


def test_estimates_rank_sensibly(session):
    tb = {t["table"]: t["bytes"] for t in queries.table_sizes(session)["tables"]}
    est = estimates.entity_estimates(session, tb)["entities"]
    # Large shared attributes count once, but still make that entity's attribute share dominant.
    assert est["sensor.big_attrs"]["attrs_bytes"] > est["sensor.chatty"]["attrs_bytes"]
    # The chatty sensor has the most rows and therefore the most state bytes.
    assert est["sensor.chatty"]["states_bytes"] > est["cover.quiet"]["states_bytes"]
    assert est["cover.quiet"]["last_ts"] < est["sensor.chatty"]["last_ts"]


def _item(eid, integration, device, domain, status, age, size):
    return {"entity_id": eid, "integration": integration, "device": device, "domain": domain,
            "status": status, "age": age, "total_bytes": size}


ITEMS = [
    _item("cover.a", "zha", "Garage", "cover", "In use", "This week", 3_000_000),
    _item("cover.b", "tuya", "Guest", "cover", "Orphaned", "6+ months", 6_000_000),
    _item("sensor.c", "zha", "Garage", "sensor", "In use", "This week", 9_000_000),
    _item("sensor.d", "template", "No device", "sensor", "Orphaned", "6+ months", 1_000_000),
]


def test_facets_cross_filter():
    f = facets.build_facets(ITEMS, {"domain": ["cover"]})
    by = {fac: {r["value"]: r["bytes"] for r in rows} for fac, rows in f.items()}
    # Domain facet ignores its own filter, so sensors are still listed.
    assert by["domain"] == {"sensor": 10_000_000, "cover": 9_000_000}
    # Other facets only count covers.
    assert {k: v for k, v in by["integration"].items() if v} == {"tuya": 6_000_000, "zha": 3_000_000}
    assert {k: v for k, v in by["status"].items() if v} == {"Orphaned": 6_000_000, "In use": 3_000_000}


def test_facet_order_is_stable_when_filters_change():
    base = facets.build_facets(ITEMS)
    ticked = facets.build_facets(ITEMS, {"domain": ["cover"]})
    assert list(base) == list(ticked) == list(facets.FACETS)
    for name in base:
        assert [r["value"] for r in base[name]] == [r["value"] for r in ticked[name]]
    # Values with nothing left under the current filters stay listed, with a zero.
    sensors = [r for r in ticked["integration"] if r["count"] == 0]
    assert all(r["bytes"] == 0 for r in sensors)


def test_facets_age_order_and_top_n():
    many = [_item(f"sensor.s{i}", f"int{i}", "d", "sensor", "In use", "This week", 1000 + i) for i in range(12)]
    rows = facets.build_facets(many, top=5)["integration"]
    assert len(rows) == 6 and rows[-1].get("other") and rows[-1]["value"] == "7 more"
    ages = facets.build_facets(ITEMS)["age"]
    assert [r["value"] for r in ages] == ["This week", "6+ months"]
    assert list(facets.FACETS)[:2] == ["suggestion", "used_in"]


def test_apply_filters_and_search():
    out = facets.apply_filters(ITEMS, {"status": ["Orphaned"]})
    assert [i["entity_id"] for i in out] == ["cover.b", "sensor.d"]  # sorted by size
    assert [i["entity_id"] for i in facets.apply_filters(ITEMS, {}, "sensor.c")] == ["sensor.c"]


def test_age_bucket():
    now = 1_000_000_000
    assert facets.age_bucket(None, now) == "No data"
    assert facets.age_bucket(now - 3600, now) == "This week"
    assert facets.age_bucket(now - 30 * 86400, now) == "1 to 6 months"
    assert facets.age_bucket(now - 300 * 86400, now) == "6+ months"


def test_journal_size_history(tmp_path):
    j = journal_mod.Journal(tmp_path / "sub" / "journal.db")
    j.setup()
    j.setup()  # idempotent
    for i in range(5):
        j.add_size(1000.0 + i, 100 + i, 10)
    hist = j.size_history(since=1002.0)
    assert [h["ts"] for h in hist] == [1002.0, 1003.0, 1004.0]
    assert hist[-1]["file_bytes"] == 104
