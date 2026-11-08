"""Standalone tests for the pure-SQL modules against a fake recorder schema."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

PKG = Path(__file__).parent.parent / "custom_components" / "db_storage_manager"


def _load(name):
    """Import a module file directly so no Home Assistant import is triggered."""
    import importlib.util

    spec = importlib.util.spec_from_file_location(name, PKG / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


queries = _load("queries")
snapshot = _load("snapshot")

SCHEMA = """
CREATE TABLE statistics_meta (id INTEGER PRIMARY KEY, statistic_id TEXT UNIQUE, source TEXT,
  unit_of_measurement TEXT, has_mean INTEGER, has_sum INTEGER, name TEXT);
CREATE TABLE statistics (id INTEGER PRIMARY KEY, created_ts REAL, metadata_id INTEGER
  REFERENCES statistics_meta(id) ON DELETE CASCADE, start_ts REAL, mean REAL, min REAL, max REAL,
  last_reset_ts REAL, state REAL, sum REAL);
CREATE TABLE statistics_short_term (id INTEGER PRIMARY KEY, created_ts REAL, metadata_id INTEGER
  REFERENCES statistics_meta(id) ON DELETE CASCADE, start_ts REAL, mean REAL, min REAL, max REAL,
  last_reset_ts REAL, state REAL, sum REAL);
CREATE INDEX ix_stats ON statistics (metadata_id, start_ts);
CREATE TABLE states (state_id INTEGER PRIMARY KEY, state TEXT);
CREATE TABLE state_attributes (attributes_id INTEGER PRIMARY KEY, shared_attrs TEXT);
CREATE TABLE states_meta (metadata_id INTEGER PRIMARY KEY, entity_id TEXT);
CREATE TABLE events (event_id INTEGER PRIMARY KEY);
CREATE TABLE event_data (data_id INTEGER PRIMARY KEY);
CREATE TABLE event_types (event_type_id INTEGER PRIMARY KEY);
"""


@pytest.fixture
def session():
    engine = create_engine("sqlite://")
    with engine.begin() as conn:
        for stmt in SCHEMA.split(";"):
            if stmt.strip():
                conn.execute(text(stmt))
        conn.execute(
            text("INSERT INTO statistics_meta (id, statistic_id, source, unit_of_measurement, has_mean, has_sum, name) "
                 "VALUES (1,'sensor.a','recorder','W',1,0,NULL),(2,'sensor.b','recorder','W',1,0,'B')")
        )
        for mid in (1, 2):
            for i in range(300):
                conn.execute(
                    text("INSERT INTO statistics (created_ts, metadata_id, start_ts, mean, min, max, state, sum) "
                         "VALUES (:t,:m,:t,1.5,1,2,3,4)"),
                    {"t": 1000.0 + i, "m": mid},
                )
            for i in range(20):
                conn.execute(
                    text("INSERT INTO statistics_short_term (created_ts, metadata_id, start_ts, mean) VALUES (:t,:m,:t,2.5)"),
                    {"t": 5000.0 + i, "m": mid},
                )
        for i in range(500):
            conn.execute(text("INSERT INTO states (state) VALUES (:s)"), {"s": "x" * 40})
    with Session(engine) as s:
        yield s


def test_table_sizes_exact_on_sqlite(session):
    res = queries.table_sizes(session)
    assert res["exact"] and res["dialect"] == "sqlite"
    by = {t["table"]: t for t in res["tables"]}
    assert by["statistics"]["bytes"] > 0
    assert by["statistics"]["rows"] == 600
    assert by["states"]["rows"] == 500
    assert res["total_bytes"] == res["page_count"] * res["page_size"]
    assert "dbstat_ms" in res["timings_ms"]


def test_statistics_counts(session):
    assert queries.statistics_counts(session, "sensor.a") == {
        "statistic_id": "sensor.a", "exists": True, "statistics": 300, "short_term": 20,
    }
    assert queries.statistics_counts(session, "sensor.nope")["exists"] is False


def test_snapshot_roundtrip(session, tmp_path):
    data = snapshot.export_statistics(session, "sensor.a")
    path = tmp_path / "snap.json.gz"
    assert snapshot.write_snapshot(path, data) > 0

    # Simulate recorder clear: removing meta cascades to both stats tables.
    session.execute(text("PRAGMA foreign_keys=ON"))
    session.execute(text("DELETE FROM statistics_meta WHERE statistic_id='sensor.a'"))
    session.commit()
    assert queries.statistics_counts(session, "sensor.a")["exists"] is False

    result = snapshot.restore_statistics(session, snapshot.read_snapshot(path))
    session.commit()
    assert result["statistics"] == 300 and result["short_term"] == 20
    after = queries.statistics_counts(session, "sensor.a")
    assert after["statistics"] == 300 and after["short_term"] == 20
    # Values restored, tied to the new metadata id, other entity untouched.
    row = session.execute(text(
        "SELECT mean, sum FROM statistics s JOIN statistics_meta m ON m.id = s.metadata_id "
        "WHERE m.statistic_id='sensor.a' LIMIT 1")).one()
    assert (row.mean, row.sum) == (1.5, 4.0)
    assert queries.statistics_counts(session, "sensor.b")["statistics"] == 300


def test_restore_merges_into_existing(session):
    data = snapshot.export_statistics(session, "sensor.b")
    # Identical rows already there: nothing inserted, nothing duplicated.
    res = snapshot.restore_statistics(session, data)
    assert res["merged"] and res["statistics"] == 0 and res["statistics_skipped"] == 300
    # One row missing: only that one comes back.
    session.execute(text("DELETE FROM statistics WHERE metadata_id = 2 AND start_ts = 1005.0"))
    res = snapshot.restore_statistics(session, data)
    assert res["statistics"] == 1
    assert queries.statistics_counts(session, "sensor.b")["statistics"] == 300


def test_restore_strict_refuses_existing(session):
    data = snapshot.export_statistics(session, "sensor.b")
    with pytest.raises(ValueError):
        snapshot.restore_statistics(session, data, merge=False)


def test_restore_rejects_unsafe_column(session):
    data = snapshot.export_statistics(session, "sensor.a")
    data["meta"]["name); DROP TABLE states;--"] = 1
    session.execute(text("DELETE FROM statistics_meta WHERE statistic_id='sensor.a'"))
    with pytest.raises(ValueError):
        snapshot.restore_statistics(session, data)
