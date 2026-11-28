"""The post-disable health check, read from recorded history: pure logic, the two history queries, the journal column."""

import importlib.util
import sqlite3
import sys
from pathlib import Path

PKG = Path(__file__).resolve().parents[1] / "custom_components" / "db_storage_manager"


def _load(name):
    spec = importlib.util.spec_from_file_location(f"dsm_{name}", PKG / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


health = _load("health")
journal = _load("journal")

CUT = 1_000_000.0
HOUR = 3600.0
NOW = CUT + 10 * HOUR


def _judge(before="5", after=(0, CUT + 600), live="unavailable", now=NOW):
    return health.judge(["sensor.a"], {"sensor.a": before}, {"sensor.a": after}, {"sensor.a": live}, CUT, now)


def test_is_working():
    assert health.is_working("0") and health.is_working("off")  # zero and "off" are real values
    assert not health.is_working(None) and not health.is_working("unavailable") and not health.is_working("unknown")


def test_permanently_down_since_the_action_is_blamed():
    out = _judge()
    assert out == [{"entity_id": "sensor.a", "down_since": CUT + 600, "after_s": 600}]


def test_a_blip_that_came_back_is_ignored():
    assert _judge(after=(1, CUT + 600), live="5") == []          # recovered: a working state since, working now
    assert _judge(after=(1, CUT + 600), live="unavailable") == []  # recovered once, down again now: not "ever since"


def test_an_entity_already_down_before_the_action_is_not_blamed():
    assert _judge(before="unavailable") == []
    assert _judge(before=None) == []   # nothing recorded before: no evidence it was working


def test_down_for_too_short_a_time_or_too_long_after_is_not_blamed():
    assert _judge(now=CUT + 600 + health.MIN_DOWN - 1) == []                      # still inside the settling time
    assert _judge(now=CUT + 600 + health.MIN_DOWN) != []
    assert _judge(after=(0, CUT + health.ATTRIBUTION_WINDOW + 1), now=CUT + 100 * HOUR) == []  # went down days later: unrelated
    assert _judge(after=(0, None)) == []   # no unavailable row recorded since: nothing to date it by


def test_an_entity_that_never_changed_is_fine():
    assert _judge(after=(0, None), live="5") == []   # no rows since the action because nothing changed


def test_results_come_back_in_order_and_remember_who_was_told():
    out = health.judge(["sensor.b", "sensor.a"], {"sensor.a": "1", "sensor.b": "1"},
                       {"sensor.a": (0, CUT + 900), "sensor.b": (0, CUT + 300)},
                       {"sensor.a": "unknown", "sensor.b": "unavailable"}, CUT, NOW)
    assert [b["entity_id"] for b in out] == ["sensor.b", "sensor.a"]   # earliest first
    first = health.result(NOW, 5, out)
    assert first["notified"] == ["sensor.a", "sensor.b"]
    later = health.result(NOW + 1, 5, [], first)    # they came back: nothing broken, but who was told is kept
    assert later["broken"] == [] and later["notified"] == ["sensor.a", "sensor.b"]


def test_message_names_the_entities_and_how_to_undo():
    broken = [{"entity_id": f"sensor.e{i}", "name": f"E{i}"} for i in range(12)]
    msg = health.message(7, "Disable: 3 entities", broken)
    assert "12 other entities" in msg and "ever since" in msg and "E0" in msg and "and 2 more" in msg and "History" in msg
    assert "1 other entity " in health.message(7, "x", broken[:1])


def _recorder():
    import sqlalchemy as sa
    eng = sa.create_engine("sqlite://")
    with eng.begin() as c:
        c.exec_driver_sql("CREATE TABLE states_meta (metadata_id INTEGER PRIMARY KEY, entity_id TEXT)")
        c.exec_driver_sql("CREATE TABLE states (state_id INTEGER PRIMARY KEY, metadata_id INTEGER, state TEXT, last_updated_ts REAL)")
        c.exec_driver_sql("INSERT INTO states_meta VALUES (1, 'sensor.a'), (2, 'sensor.b'), (3, 'sensor.c')")
        rows = [
            (1, "3", CUT - 5000), (1, "5", CUT - 100), (1, "unavailable", CUT + 600), (1, "unknown", CUT + 700),  # a: ok, then down for good
            (2, "7", CUT - 50), (2, "unavailable", CUT + 100), (2, "7", CUT + 400),                                # b: a blip
            (3, "unavailable", CUT - 900),                                                                          # c: already down
        ]
        for m, st, ts in rows:
            c.exec_driver_sql("INSERT INTO states (metadata_id, state, last_updated_ts) VALUES (?, ?, ?)", (m, st, ts))
    return eng


def test_history_queries_and_judge_together():
    queries = _load("queries")
    ids = ["sensor.a", "sensor.b", "sensor.c", "sensor.gone"]
    with _recorder().connect() as session:
        before = queries.state_before(session, ids, CUT)
        after = queries.states_after(session, ids, CUT)
    assert before == {"sensor.a": "5", "sensor.b": "7", "sensor.c": "unavailable"}   # the last row before, not an older one
    assert after == {"sensor.a": (0, CUT + 600), "sensor.b": (1, CUT + 100)}
    live = {"sensor.a": "unknown", "sensor.b": "7", "sensor.c": "unavailable", "sensor.gone": None}
    out = health.judge(ids, before, after, live, CUT, NOW)
    assert [b["entity_id"] for b in out] == ["sensor.a"]   # b was a blip, c was already down, gone has no history


def test_journal_stores_meta_and_upgrades_an_old_database(tmp_path):
    path = tmp_path / "journal.db"
    old = sqlite3.connect(path)   # an actions table as v4 left it, without meta_json
    old.executescript("""CREATE TABLE actions (id INTEGER PRIMARY KEY AUTOINCREMENT, ts REAL NOT NULL, kind TEXT NOT NULL,
        summary TEXT, status TEXT NOT NULL, entities_json TEXT NOT NULL, est_bytes INTEGER, undone_ts REAL, error TEXT);
        INSERT INTO actions (ts, kind, summary, status, entities_json) VALUES (1, 'disable', 'old', 'applied', '[]');""")
    old.commit(); old.close()
    j = journal.Journal(path)
    j.setup()
    assert j.get_action(1)["meta"] == {}   # an action from before the upgrade has none
    aid = j.add_action(2.0, "disable", "new", [{"entity_id": "sensor.x"}], 0)
    j.update_action(aid, status="applied", meta={"health": health.result(5.0, 3, [])})
    got = j.get_action(aid)
    assert got["meta"]["health"]["siblings"] == 3 and got["entities"] == [{"entity_id": "sensor.x"}]
    j.update_action(aid, entities=[{"entity_id": "sensor.x", "ok": True}])   # updating entities leaves meta alone
    assert j.get_action(aid)["meta"]["health"]["siblings"] == 3
