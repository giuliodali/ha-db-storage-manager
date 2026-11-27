"""The database-facing SQL, run against every database the recorder supports.

SQLite always runs. PostgreSQL and MariaDB/MySQL run when a URL is given in the environment:

    DBS_TEST_POSTGRES_URL=postgresql+psycopg2://user:pw@host/db
    DBS_TEST_MARIADB_URL=mysql+pymysql://user:pw@host/db
    DBS_TEST_MYSQL_URL=mysql+pymysql://user:pw@host/db

``DBS_TEST_REQUIRE`` (comma-separated: postgresql, mariadb, mysql) turns a missing URL into a
failure, so a CI job for one database can never pass by silently skipping it.
No Home Assistant imports: the package is loaded without running its ``__init__``.
"""

from __future__ import annotations

import importlib
import os
import sys
import time
import types
from pathlib import Path

import pytest
from sqlalchemy import (BigInteger, Column, Float, Integer, MetaData, String, Table, Text, create_engine,
                        delete, insert, select, text)
from sqlalchemy.orm import Session

PKG = Path(__file__).parent.parent / "custom_components" / "db_storage_manager"
_pkg = types.ModuleType("dbs_pkg")
_pkg.__path__ = [str(PKG)]
sys.modules.setdefault("dbs_pkg", _pkg)
queries = importlib.import_module("dbs_pkg.queries")
estimates = importlib.import_module("dbs_pkg.estimates")
snapshot = importlib.import_module("dbs_pkg.snapshot")
backup = importlib.import_module("dbs_pkg.backup")

ENV = {
    "sqlite": None,
    "postgresql": "DBS_TEST_POSTGRES_URL",
    "mariadb": "DBS_TEST_MARIADB_URL",
    "mysql": "DBS_TEST_MYSQL_URL",
}
EXPECT_DIALECT = {"sqlite": "sqlite", "postgresql": "postgresql", "mariadb": "mysql", "mysql": "mysql"}
EXACT = {"sqlite": True, "postgresql": True, "mariadb": False, "mysql": False}

# A recorder-shaped schema that is valid on all three databases.
_BIG = BigInteger().with_variant(Integer, "sqlite")  # SQLite only autoincrements INTEGER keys
_DBL = Float(53)
md = MetaData()
Table("states_meta", md, Column("metadata_id", _BIG, primary_key=True), Column("entity_id", String(255), unique=True))
Table("state_attributes", md, Column("attributes_id", _BIG, primary_key=True), Column("hash", BigInteger),
      Column("shared_attrs", Text))
Table("states", md, Column("state_id", _BIG, primary_key=True), Column("state", String(255)),
      Column("attributes_id", BigInteger), Column("metadata_id", BigInteger), Column("last_updated_ts", _DBL),
      Column("last_changed_ts", _DBL), Column("old_state_id", BigInteger), Column("event_id", BigInteger))
Table("statistics_meta", md, Column("id", _BIG, primary_key=True), Column("statistic_id", String(255), unique=True),
      Column("source", String(32)), Column("unit_of_measurement", String(255)), Column("has_mean", Integer),
      Column("has_sum", Integer), Column("name", String(255)))
for _t in ("statistics", "statistics_short_term"):
    Table(_t, md, Column("id", _BIG, primary_key=True), Column("created_ts", _DBL), Column("metadata_id", BigInteger),
          Column("start_ts", _DBL), Column("mean", _DBL), Column("min", _DBL), Column("max", _DBL),
          Column("last_reset_ts", _DBL), Column("state", _DBL), Column("sum", _DBL))
Table("events", md, Column("event_id", _BIG, primary_key=True))
Table("event_data", md, Column("data_id", _BIG, primary_key=True))
Table("event_types", md, Column("event_type_id", _BIG, primary_key=True))

NOW = time.time()
DAY = 86400.0
MONTH = 30 * DAY


def _url(name: str, tmp_path: Path) -> str:
    if name == "sqlite":
        return f"sqlite:///{tmp_path / 'recorder.db'}"
    url = os.environ.get(ENV[name] or "")
    if url:
        return url
    required = {x.strip() for x in os.environ.get("DBS_TEST_REQUIRE", "").split(",")}
    if name in required:
        pytest.fail(f"{ENV[name]} is not set but {name} is required")
    pytest.skip(f"{ENV[name]} is not set")


@pytest.fixture(params=list(ENV))
def db(request, tmp_path):
    name = request.param
    engine = create_engine(_url(name, tmp_path))
    md.drop_all(engine)
    md.create_all(engine)
    seed(engine)
    with Session(engine) as session:
        assert session.get_bind().dialect.name == EXPECT_DIALECT[name]
        yield name, session, engine
    md.drop_all(engine)
    engine.dispose()


def seed(engine) -> None:
    with engine.begin() as c:
        c.execute(insert(md.tables["states_meta"]), [{"metadata_id": 1, "entity_id": "sensor.chatty"},
                                                     {"metadata_id": 2, "entity_id": "light.kitchen"}])
        c.execute(insert(md.tables["state_attributes"]), [{"attributes_id": 1, "hash": 111, "shared_attrs": '{"a":1}'},
                                                          {"attributes_id": 2, "hash": 222, "shared_attrs": "x" * 3000}])
        states = [{"state": "12.5", "attributes_id": 1, "metadata_id": 1, "last_updated_ts": NOW - i * 60,
                   "last_changed_ts": NOW - i * 60} for i in range(300)]
        states += [{"state": "on", "attributes_id": 2, "metadata_id": 2, "last_updated_ts": NOW - 5 * DAY - i * 60,
                    "last_changed_ts": NOW - 5 * DAY - i * 60} for i in range(40)]
        c.execute(insert(md.tables["states"]), states)
        c.execute(insert(md.tables["statistics_meta"]), [
            {"id": 1, "statistic_id": "sensor.chatty", "source": "recorder", "unit_of_measurement": "W",
             "has_mean": 1, "has_sum": 0, "name": None},
            {"id": 2, "statistic_id": "sensor.ghost", "source": "recorder", "unit_of_measurement": "kWh",
             "has_mean": 0, "has_sum": 1, "name": "Ghost"}])
        for table, step, n in (("statistics", 3600, 200), ("statistics_short_term", 300, 60)):
            c.execute(insert(md.tables[table]), [
                {"created_ts": NOW, "metadata_id": mid, "start_ts": NOW - i * step, "mean": 1.5, "min": 1.0,
                 "max": 2.0, "last_reset_ts": None, "state": 3.0, "sum": 4.0}
                for mid in (1, 2) for i in range(n)])


def count(session, table: str, where: str = "1=1", **params) -> int:
    return int(session.execute(text(f"SELECT COUNT(*) FROM {table} WHERE {where}"), params).scalar())  # noqa: S608


# --- sizes ------------------------------------------------------------------------------------

def test_table_sizes(db):
    name, session, _ = db
    res = queries.table_sizes(session)
    assert res["dialect"] == EXPECT_DIALECT[name] and res["supported"] is True
    assert res["exact"] is EXACT[name]
    tables = {t["table"]: t for t in res["tables"]}
    for t in queries.RECORDER_TABLES:
        assert t in tables, f"{t} missing from {sorted(tables)}"
        assert tables[t]["bytes"] > 0
    assert tables["states"]["rows"] == 340
    assert tables["statistics"]["rows"] == 400 and tables["statistics_short_term"]["rows"] == 120
    assert [t["bytes"] for t in res["tables"]] == sorted((t["bytes"] for t in res["tables"]), reverse=True)
    assert res["total_bytes"] >= sum(tables[t]["bytes"] for t in queries.RECORDER_TABLES)


def test_free_space_is_reported_or_unknown(db):
    name, session, _ = db
    pages = queries.page_stats(session)
    assert pages["total_bytes"] > 0
    if name == "postgresql":
        assert pages["free_bytes"] is None
    else:
        assert isinstance(pages["free_bytes"], int) and 0 <= pages["free_bytes"] <= pages["total_bytes"]
    assert queries.table_sizes(session)["free_bytes"] == pages["free_bytes"] if name != "sqlite" else True


def test_statistics_bytes_is_part_of_the_database(db):
    _, session, _ = db
    stats = queries.statistics_bytes(session)
    assert 0 < stats <= queries.page_stats(session)["total_bytes"]
    tables = {t["table"]: t["bytes"] for t in queries.table_sizes(session, with_rows=False)["tables"]}
    assert stats == sum(tables[t] for t in queries.STATS_TABLES)


def test_database_size_follows_the_data(db):
    name, session, engine = db
    if name == "postgresql":
        pytest.skip("pg_database_size changes with autovacuum timing")
    before = queries.page_stats(session)
    with engine.begin() as c:
        c.execute(insert(md.tables["state_attributes"]), [{"hash": 1000 + i, "shared_attrs": "y" * 4000} for i in range(400)])
    session.rollback()  # end the read transaction so the new rows are visible
    after = queries.page_stats(session)
    assert after["total_bytes"] >= before["total_bytes"]


# --- per-entity estimates ----------------------------------------------------------------------

def test_estimates_add_up_to_table_sizes(db):
    _, session, _ = db
    scan = queries.table_sizes(session)
    tb = {t["table"]: t["bytes"] for t in scan["tables"]}
    ents = estimates.entity_estimates(session, tb)["entities"]
    assert set(ents) == {"sensor.chatty", "light.kitchen", "sensor.ghost"}
    assert ents["sensor.chatty"]["states_rows"] == 300 and ents["sensor.chatty"]["stats_rows"] == 200
    assert ents["sensor.ghost"]["states_rows"] == 0 and ents["sensor.ghost"]["short_rows"] == 60
    assert sum(e["states_bytes"] for e in ents.values()) == pytest.approx(tb["states"] + tb["states_meta"])
    assert sum(e["attrs_bytes"] for e in ents.values()) == pytest.approx(tb["state_attributes"])
    assert sum(e["stats_bytes"] for e in ents.values()) == pytest.approx(tb["statistics"] + tb["statistics_short_term"])
    assert ents["light.kitchen"]["attrs_bytes"] > ents["sensor.chatty"]["attrs_bytes"]  # the big payload is counted once


def test_partial_estimates_and_known_ids(db):
    _, session, _ = db
    tb = {t["table"]: t["bytes"] for t in queries.table_sizes(session)["tables"]}
    full = estimates.entity_estimates(session, tb)["entities"]
    assert estimates.known_ids(session) == set(full)
    part = estimates.partial_estimates(session, tb, full, {"sensor.chatty"})
    assert part["refreshed"] == 1 and set(part["entities"]) == set(full)


def test_window_activity_counts_rows_by_time(db):
    _, session, _ = db
    act = estimates.window_activity(session, NOW - 2 * DAY, NOW + 60)["rows"]
    assert act["sensor.chatty"]["states"] == 300 and "light.kitchen" not in act
    assert act["sensor.chatty"]["stats"] > 0


# --- retention predictions ---------------------------------------------------------------------

def _hist(rows):
    return {int(d): int(n) for d, n in rows}


def test_state_age_histogram_rounds_down(db):
    _, session, engine = db
    with engine.begin() as c:
        c.execute(delete(md.tables["states"]))
        c.execute(insert(md.tables["states"]), [
            {"state": "1", "metadata_id": 1, "last_updated_ts": NOW - age * DAY}
            for age in (0.2, 0.9, 1.1, 1.9, 2.5, 7.99)])
    dialect = queries.dialect_name(session)
    rows = session.execute(queries.state_histogram_sql(dialect), {"now": NOW}).all()
    assert _hist(rows) == {0: 2, 1: 2, 2: 1, 7: 1}
    rows = session.execute(queries.state_histogram_sql(dialect, ids=True), {"now": NOW, "ids": ["sensor.chatty"]}).all()
    assert _hist(rows) == {0: 2, 1: 2, 2: 1, 7: 1}
    assert session.execute(queries.state_histogram_sql(dialect, ids=True), {"now": NOW, "ids": ["light.kitchen"]}).all() == []


def test_statistics_age_histogram_rounds_down(db):
    _, session, engine = db
    with engine.begin() as c:
        c.execute(delete(md.tables["statistics"]))
        c.execute(insert(md.tables["statistics"]), [
            {"metadata_id": mid, "start_ts": NOW - age * MONTH, "mean": 1.0}
            for mid, age in ((1, 0.4), (1, 0.95), (1, 1.6), (2, 3.9))])
    rows = session.execute(queries.stats_histogram_sql(queries.dialect_name(session)), {"now": NOW, "month": MONTH}).all()
    assert {(int(m), int(d)): int(n) for m, d, n in rows} == {(1, 0): 2, (1, 1): 1, (2, 3): 1}


def test_trimming_statistics_deletes_in_batches(db):
    _, session, engine = db
    with engine.begin() as c:
        c.execute(delete(md.tables["statistics"]))
        c.execute(insert(md.tables["statistics"]), [
            {"metadata_id": 1, "start_ts": NOW - 400 * DAY - i, "mean": 1.0} for i in range(10)]
            + [{"metadata_id": 2, "start_ts": NOW - 400 * DAY - i, "mean": 1.0} for i in range(3)]
            + [{"metadata_id": 1, "start_ts": NOW - 10 * DAY - i, "mean": 1.0} for i in range(5)])
    cut = NOW - 365 * DAY
    first = session.execute(queries.TRIM_STATISTICS_SQL, {"mids": [1], "cut": cut, "n": 4}).rowcount
    assert first == 4
    second = session.execute(queries.TRIM_STATISTICS_SQL, {"mids": [1], "cut": cut, "n": 100}).rowcount
    assert second == 6
    session.commit()
    assert count(session, "statistics", "metadata_id = 1") == 5   # the recent rows stay
    assert count(session, "statistics", "metadata_id = 2") == 3   # other statistics are untouched


# --- recorder reads ----------------------------------------------------------------------------

def test_statistics_counts_and_entity_rows(db):
    _, session, _ = db
    assert queries.statistics_counts(session, "sensor.chatty") == {
        "statistic_id": "sensor.chatty", "exists": True, "statistics": 200, "short_term": 60}
    assert queries.statistics_counts(session, "sensor.nope")["exists"] is False
    rows = queries.entity_rows(session, "sensor.chatty", "states", 5)
    assert rows and len(rows["rows"]) == 5


# --- backup and undo ---------------------------------------------------------------------------

def test_statistics_snapshot_roundtrip(db, tmp_path):
    _, session, _ = db
    data = snapshot.export_statistics(session, "sensor.chatty")
    assert len(data["statistics"]) == 200 and len(data["statistics_short_term"]) == 60
    path = tmp_path / "snap.json.gz"
    snapshot.write_snapshot(path, data)
    session.execute(text("DELETE FROM statistics WHERE metadata_id = 1"))
    session.execute(text("DELETE FROM statistics_short_term WHERE metadata_id = 1"))
    session.execute(text("DELETE FROM statistics_meta WHERE id = 1"))
    session.commit()
    assert queries.statistics_counts(session, "sensor.chatty")["exists"] is False
    out = snapshot.restore_statistics(session, snapshot.read_snapshot(path))
    session.commit()
    assert not out["merged"]
    after = queries.statistics_counts(session, "sensor.chatty")
    assert after["statistics"] == 200 and after["short_term"] == 60
    # restoring again adds nothing, and the recorder can still write (keys were not reused)
    snapshot.restore_statistics(session, snapshot.read_snapshot(path))
    session.commit()
    assert queries.statistics_counts(session, "sensor.chatty")["statistics"] == 200
    session.execute(text("INSERT INTO statistics (metadata_id, start_ts, mean) VALUES (:m, :t, 1)"), {"m": out["metadata_id"], "t": NOW + 5})
    session.commit()


def test_batch_backup_roundtrip(db, tmp_path):
    _, session, _ = db
    path = tmp_path / "batch.ndjson.gz"
    out = backup.export_batch(session, path, ["sensor.chatty", "sensor.ghost"], ["sensor.chatty", "light.kitchen"])
    c = out["counts"]
    assert c["sensor.chatty"]["statistics"] == 200 and c["sensor.chatty"]["states"] == 300
    assert c["light.kitchen"]["states"] == 40 and c["sensor.ghost"]["short_term"] == 60
    for sql in ("DELETE FROM states", "DELETE FROM state_attributes", "DELETE FROM statistics",
                "DELETE FROM statistics_short_term", "DELETE FROM statistics_meta", "DELETE FROM states_meta"):
        session.execute(text(sql))
    session.commit()
    restored = backup.restore_batch(session, path)["entities"]
    session.commit()
    assert restored["sensor.chatty"]["states"] == 300 and restored["light.kitchen"]["states"] == 40
    assert count(session, "states") == 340 and count(session, "statistics") == 400
    assert count(session, "statistics_short_term") == 120
    # attributes are shared again, not duplicated per state
    assert count(session, "state_attributes") == 2
    big = session.execute(text(
        "SELECT sa.shared_attrs FROM states s JOIN state_attributes sa ON sa.attributes_id = s.attributes_id "
        "JOIN states_meta sm ON sm.metadata_id = s.metadata_id WHERE sm.entity_id = 'light.kitchen' LIMIT 1")).scalar()
    assert big == "x" * 3000
    # a second restore skips what is already there
    again = backup.restore_batch(session, path)["entities"]
    session.commit()
    assert again["sensor.chatty"]["states"] == 0 and again["sensor.chatty"]["skipped"] > 0
    assert count(session, "states") == 340


def test_batch_backup_keeps_only_rows_before_the_cut(db, tmp_path):
    _, session, _ = db
    path = tmp_path / "cut.ndjson.gz"
    out = backup.export_batch(session, path, [], ["sensor.chatty"], states_before=NOW - 100 * 60 + 1)
    assert out["counts"]["sensor.chatty"]["states"] == 200  # the 200 rows older than 100 minutes
