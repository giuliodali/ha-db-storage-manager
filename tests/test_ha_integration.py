"""Runs against real Home Assistant core + a real recorder (pytest-homeassistant-custom-component)."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from homeassistant.components.recorder.statistics import async_add_external_statistics
from homeassistant.components.recorder.models import StatisticData, StatisticMetaData
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from custom_components.db_storage_manager import retention
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done
from pytest_homeassistant_custom_component.typing import RecorderInstanceContextManager

DOMAIN = "db_storage_manager"


async def _setup(hass):
    import shutil
    shutil.rmtree(hass.config.path("db_storage_manager", "snapshots"), ignore_errors=True)  # config dir is shared
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _ws(client, type_, **kw):
    await client.send_json_auto_id({"type": f"db_storage/{type_}", **kw})
    return await client.receive_json()


async def test_panel_and_ping(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    assert "db-storage" in hass.data["frontend_panels"]
    client = await hass_ws_client(hass)
    res = await _ws(client, "ping")
    assert res["success"] and res["result"]["integration_version"] == "1.0.3"


async def test_scan(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    res = await _ws(client, "scan")
    assert res["success"], res
    names = {t["table"] for t in res["result"]["tables"]}
    assert {"states", "statistics", "statistics_meta"} <= names
    assert res["result"]["exact"] is True


async def test_delete_and_restore_statistics(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    meta = StatisticMetaData(
        has_mean=True, has_sum=False, name="Test", source="test",
        statistic_id="test:foo", unit_of_measurement="W", mean_type=1, unit_class=None,
    ) if _supports_mean_type() else StatisticMetaData(
        has_mean=True, has_sum=False, name="Test", source="test",
        statistic_id="test:foo", unit_of_measurement="W",
    )
    stats = [
        StatisticData(start=start + timedelta(hours=i), mean=float(i), min=0.0, max=10.0)
        for i in range(24)
    ]
    async_add_external_statistics(hass, meta, stats)
    await async_wait_recording_done(hass)

    client = await hass_ws_client(hass)
    info = await _ws(client, "stats_info", statistic_id="test:foo")
    assert info["result"]["statistics"] == 24

    dry = await _ws(client, "delete_statistics", statistic_id="test:foo")
    assert dry["result"]["dry_run"] is True

    done = await _ws(client, "delete_statistics", statistic_id="test:foo", confirm=True)
    assert done["success"], done
    assert done["result"]["after"]["exists"] is False
    snap = done["result"]["snapshot"]["snapshot"]
    assert done["result"]["snapshot"]["statistics"] == 24

    # A live sensor writes a new row, recreating the statistic before we restore.
    async_add_external_statistics(
        hass, meta,
        [StatisticData(start=start + timedelta(hours=30), mean=1.0, min=0.0, max=2.0)],
    )
    await async_wait_recording_done(hass)

    strict = await _ws(client, "restore_statistics", snapshot=snap, merge=False)
    assert not strict["success"]

    restored = await _ws(client, "restore_statistics", snapshot=snap)
    assert restored["success"], restored
    assert restored["result"]["merged"] is True
    after = await _ws(client, "stats_info", statistic_id="test:foo")
    assert after["result"]["statistics"] == 25  # 24 restored + 1 written since


async def test_disable_and_enable_entity(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "test", "uid1", suggested_object_id="thing")
    client = await hass_ws_client(hass)
    off = await _ws(client, "set_entity_disabled", entity_id="sensor.thing", disabled=True)
    assert off["result"]["disabled_by"] == "user" and off["result"]["previous_disabled_by"] is None
    assert registry.async_get("sensor.thing").disabled_by == er.RegistryEntryDisabler.USER
    on = await _ws(client, "set_entity_disabled", entity_id="sensor.thing", disabled=False)
    assert on["result"]["disabled_by"] is None


def _supports_mean_type() -> bool:
    import inspect
    return "mean_type" in StatisticMetaData.__annotations__


async def test_entities_inventory_and_facets(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "demo", "u1", suggested_object_id="alpha")
    registry.async_get_or_create("sensor", "demo", "u2", suggested_object_id="beta", disabled_by=er.RegistryEntryDisabler.USER)
    hass.states.async_set("sensor.alpha", "1", {"unit": "W"})
    hass.states.async_set("sensor.beta", "2")
    hass.states.async_set("sensor.ghost", "3")  # not in the registry, but in the state machine
    for i in range(5):
        hass.states.async_set("sensor.alpha", str(i + 10))
    await async_wait_recording_done(hass)

    client = await hass_ws_client(hass)
    res = await _ws(client, "entities", refresh=True, wait=True)
    assert res["success"], res
    by = {i["entity_id"]: i for i in res["result"]["items"]}
    assert by["sensor.alpha"]["status"] == "Active" and by["sensor.alpha"]["integration"] == "demo"
    assert by["sensor.beta"]["status"] == "Disabled"
    assert by["sensor.alpha"]["states_rows"] >= 5
    assert res["result"]["facets"]["status"]

    # Estimates reconcile to the dbstat totals reported alongside them.
    tables = {t["table"]: t["bytes"] for t in res["result"]["tables"]}
    states_side = sum(i["states_bytes"] for i in res["result"]["items"])
    assert abs(states_side - (tables["states"] + tables.get("states_meta", 0))) < 50 * len(by)

    filtered = await _ws(client, "entities", wait=True, filters={"status": ["Disabled"]})
    assert [i["entity_id"] for i in filtered["result"]["items"]] == ["sensor.beta"]
    # Status facet ignores its own filter; integration facet narrows to the disabled entity.
    assert {r["value"] for r in filtered["result"]["facets"]["status"]} >= {"Active", "Disabled"}
    assert [r["value"] for r in filtered["result"]["facets"]["integration"] if r["count"]] == ["demo"]


async def test_size_sensor_and_history(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    sample = await _ws(client, "sample_now")
    assert sample["success"] and sample["result"]["file_bytes"] > 0
    await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    eid = ent_reg.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_file_bytes")
    assert eid is not None
    state = hass.states.get(eid)
    assert state.state not in ("unknown", "unavailable")
    assert state.attributes["unit_of_measurement"] == "MB"
    assert state.attributes["state_class"] == "measurement"
    assert state.attributes["device_class"] == "data_size"

    hist = await _ws(client, "size_history", days=1)
    assert hist["success"] and len(hist["result"]) >= 1


async def test_usage_from_helper_and_yaml(recorder_mock, enable_custom_integrations, hass, hass_ws_client, tmp_path) -> None:
    from custom_components.db_storage_manager.usage import Matcher, Usage
    from custom_components.db_storage_manager.usage_sources import scan_yaml_dir

    # A helper config entry that references sensor.alpha in its options.
    MockConfigEntry(domain="threshold", title="Alpha high", data={}, options={"entity_id": "sensor.alpha", "upper": 5}).add_to_hass(hass)
    await _setup(hass)
    hass.states.async_set("sensor.alpha", "1")
    hass.states.async_set("sensor.unused", "1")
    await async_wait_recording_done(hass)

    client = await hass_ws_client(hass)
    inv = await _ws(client, "entities", refresh=True, wait=True)
    by = {i["entity_id"]: i for i in inv["result"]["items"]}
    assert by["sensor.alpha"]["used_in"] == ["Helper"] and by["sensor.alpha"]["used_count"] == 1
    assert by["sensor.unused"]["used_in"] == ["Not referenced"]
    assert inv["result"]["caveats"] and "Helper" in inv["result"]["usage_sources"]

    detail = await _ws(client, "usage", entity_id="sensor.alpha")
    loc = detail["result"]["locations"][0]
    assert loc["kind"] == "Helper" and "Alpha high" in loc["name"] and loc["where"] == "options.entity_id"
    assert loc["link"] == "/config/helpers"

    # Facet: only the unreferenced entities.
    only = await _ws(client, "entities", wait=True, filters={"used_in": ["Not referenced"]})
    assert "sensor.alpha" not in {i["entity_id"] for i in only["result"]["items"]}

    # YAML scan on a throwaway folder (does not touch the test config dir).
    (tmp_path / "automations.yaml").write_text(
        "- id: '1'\n  alias: Alpha watcher\n  triggers:\n  - trigger: state\n    entity_id: sensor.alpha\n  actions: []\n"
        "- id: '2'\n  alias: Everything\n  actions:\n  - variables:\n      x: \"{{ states.sensor | list }}\"\n"
        "- id: db_storage_retention\n  alias: 'DB Storage: nightly retention'\n  actions:\n"
        "  - action: recorder.purge_entities\n    target:\n      entity_id: sensor.alpha\n"
    )
    (tmp_path / "secrets.yaml").write_text("password: sensor.alpha\n")
    u = Usage()
    await hass.async_add_executor_job(scan_yaml_dir, str(tmp_path), Matcher({"sensor.alpha", "sensor.unused"}, {}), u)
    locs = u.locations["sensor.alpha"]
    assert [(l["kind"], l["name"], l["link"]) for l in locs] == [("Automation", "Alpha watcher", "/config/automation/edit/1")]
    assert u.domain_wide["sensor"] == ["Everything"]  # and our own nightly automation is not a reference


async def test_background_scan_progress_and_persistence(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    import asyncio
    from custom_components.db_storage_manager import websocket as w

    import os
    stale = hass.config.path("db_storage_manager", "inventory.json.gz")
    if os.path.exists(stale):  # the test config dir is shared between tests
        os.remove(stale)
    await _setup(hass)
    hass.states.async_set("sensor.alpha", "1")
    hass.states.async_set("sensor.alpha", "2")
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)

    # Cold: returns at once, scan runs in the background with step progress.
    res = await _ws(client, "entities")
    assert res["result"] == {"no_data": True, "scanning": True}
    seen = None
    for _ in range(100):
        st = (await _ws(client, "scan_status"))["result"]
        seen = st
        if not st["running"]:
            break
        await asyncio.sleep(0.05)
    assert seen["error"] is None
    assert [s["status"] for s in seen["steps"]] == ["done"] * 6
    assert all(s["ms"] is not None for s in seen["steps"])

    res = await _ws(client, "entities")
    assert any(i["entity_id"] == "sensor.alpha" for i in res["result"]["items"])
    assert res["result"]["scanning"] is False and res["result"]["from_disk"] is False

    # Single flight: two refreshes share one task.
    t1 = w.start_scan(hass)
    t2 = w.start_scan(hass)
    assert t1 is t2
    await t1

    # Persisted: drop the in-memory cache and reload from disk.
    hass.data[DOMAIN].pop("inventory")
    await w.async_load_inventory(hass)
    res = await _ws(client, "entities")
    assert res["result"]["from_disk"] is True
    assert any(i["entity_id"] == "sensor.alpha" for i in res["result"]["items"])
    usage = await _ws(client, "usage", entity_id="sensor.alpha")
    assert usage["success"]


async def test_snapshot_interval_option_and_gating(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    import os, time
    stale = hass.config.path("db_storage_manager", "journal.db")
    if os.path.exists(stale):
        os.remove(stale)
    entry = await _setup(hass)
    sampler = hass.data[DOMAIN]["sampler"]
    journal = hass.data[DOMAIN]["journal"]
    assert sampler.interval_s == 86400  # default is daily

    def rows():
        return len(journal.size_history(0))

    base = rows()
    sampler.last_recorded = time.time()
    before = sampler.last
    await sampler.async_tick()                    # not due: nothing measured, sensors unchanged
    assert rows() == base and sampler.last is before
    sampler.last_recorded = time.time() - 90000
    await sampler.async_tick()                    # a day has passed: one row
    assert rows() == base + 1
    await sampler.async_sample()                  # "Sample now" always records
    assert rows() == base + 2

    # Changing the option takes effect immediately, without a reload.
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == "form"
    result = await hass.config_entries.options.async_configure(result["flow_id"], {"sample_interval": "hourly"})
    assert result["type"] == "create_entry"
    await hass.async_block_till_done()
    assert sampler.interval_s == 3600
    sampler.last_recorded = time.time() - 3500    # 58 min: within the 5 min slack
    assert sampler.due()


async def test_suggestions_and_period_window(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    import time

    await _setup(hass)
    hass.states.async_set("sensor.ghosty", "1")      # no registry entry, then removed: orphaned
    hass.states.async_set("sensor.ghosty", "2")
    hass.states.async_set("sensor.chatty", "1")
    for i in range(30):
        hass.states.async_set("sensor.chatty", str(i + 2))
    await async_wait_recording_done(hass)
    hass.states.async_remove("sensor.ghosty")
    client = await hass_ws_client(hass)

    res = await _ws(client, "entities", refresh=True, wait=True)
    items = {i["entity_id"]: i for i in res["result"]["items"]}
    assert items["sensor.ghosty"]["status"] == "Orphaned"
    assert items["sensor.ghosty"]["suggestion"] == "Remove history"
    assert items["sensor.chatty"]["suggestion"] == "Review"       # active, unreferenced
    suggestions = {r["value"] for r in res["result"]["facets"]["suggestion"]}
    assert {"Remove history", "Review"} <= suggestions
    assert res["result"]["window"] is None

    now = time.time()
    res = await _ws(client, "entities", wait=True, window=[now - 600, now + 60])
    r = res["result"]
    assert r["window"]["keep_days"] >= 1
    by = {i["entity_id"]: i for i in r["items"]}
    assert by["sensor.chatty"]["win_states"] >= 30
    assert r["items"][0]["entity_id"] == "sensor.chatty"          # busiest first
    assert r["match_bytes"] == sum(i["win_bytes"] for i in r["items"])

    empty = await _ws(client, "entities", wait=True, window=[now - 90 * 86400, now - 89 * 86400])
    assert empty["result"]["items"] == [] and empty["result"]["match_count"] == 0

    bad = await _ws(client, "entities", wait=True, window=[now, now - 10])
    assert not bad["success"]


async def test_reclaim_db_size_names_and_dashboard_icons(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    from custom_components.db_storage_manager.usage import Matcher, Usage, scan_json, lovelace_label, view_meta

    await _setup(hass)
    hass.states.async_set("sensor.named", "1", {"friendly_name": "Hall Temperature"})
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)

    size = await _ws(client, "db_size")
    assert size["success"] and size["result"]["file_bytes"] > 0
    hist_before = hass.data[DOMAIN]["journal"].size_history(0)

    res = await _ws(client, "entities", refresh=True, wait=True)
    after_scan = hass.data[DOMAIN]["journal"].size_history(0)
    assert len(after_scan) == len(hist_before) + 1 and "undo_bytes" in after_scan[-1]   # a scan adds a chart point
    assert after_scan[-1]["stats_bytes"] is not None and after_scan[-1]["stats_bytes"] > 0   # split of long-term statistics
    hist_before = after_scan
    by = {i["entity_id"]: i for i in res["result"]["items"]}
    assert by["sensor.named"]["name"] == "Hall Temperature"
    found = await _ws(client, "entities", wait=True, search="hall temp")      # search matches friendly names
    assert [i["entity_id"] for i in found["result"]["items"]] == ["sensor.named"]
    hidden = await _ws(client, "entities", wait=True, exclude_domains=["sensor"])
    assert "sensor.named" not in [i["entity_id"] for i in hidden["result"]["items"]]
    assert hass.data[DOMAIN]["journal"].size_history(0) == hist_before       # searching and db_size record nothing

    refused = await _ws(client, "reclaim", confirm=False)
    assert not refused["success"]
    started = await _ws(client, "reclaim", confirm=True)
    assert started["success"] and started["result"]["started"] is True
    await async_wait_recording_done(hass)

    # Dashboard tabs: one location per view, each with its own icon and link.
    conf = {"views": [
        {"title": "Energy", "icon": "mdi:flash", "path": "energy", "cards": [{"type": "gauge", "entity": "sensor.named"}]},
        {"title": "Home", "cards": [{"type": "entity", "entity": "sensor.named"}]},
    ]}
    usage = Usage()
    hits, _ = scan_json(Matcher({"sensor.named"}, {}), conf, lovelace_label)
    usage.add("Dashboard", "Main", "/lovelace/0", hits, group_meta=view_meta(conf, None))
    locs = {l["where"].split(",")[0]: l for l in usage.locations["sensor.named"]}
    assert locs['view "Energy"']["icon"] == "mdi:flash" and locs['view "Energy"']["link"] == "/lovelace/energy"
    assert locs['view "Home"']["icon"] is None and locs['view "Home"']["link"] == "/lovelace/1"
    assert usage.summary("sensor.named", "sensor")["used_count"] == 2       # each dashboard view (tab) is a place


async def test_db_size_reports_logical_size_and_checkpoint(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    hass.states.async_set("sensor.x", "1")
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    res = (await _ws(client, "db_size"))["result"]
    assert res["file_bytes"] > 0 and "wal_bytes" in res and "main_bytes" in res
    assert res["file_bytes"] >= res["free_bytes"]
    cp = (await _ws(client, "db_size", checkpoint=True))["result"]
    assert cp["checkpoint"] is not None           # [busy, log frames, checkpointed frames]
    assert cp["wal_bytes"] == 0 or cp["checkpoint"][0] == 1


async def _wait_job(client, tries: int = 200) -> dict:
    import asyncio

    for _ in range(tries):
        st = (await _ws(client, "action_status"))["result"]
        if not st["running"]:
            return st
        await asyncio.sleep(0.05)
    raise AssertionError("job did not finish")


async def test_clear_history_action_journal_and_undo(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    meta = (StatisticMetaData(
        has_mean=True, has_sum=False, name="Test", source="test",
        statistic_id="test:foo", unit_of_measurement="W", mean_type=1, unit_class=None,
    ) if _supports_mean_type() else StatisticMetaData(
        has_mean=True, has_sum=False, name="Test", source="test",
        statistic_id="test:foo", unit_of_measurement="W",
    ))
    async_add_external_statistics(hass, meta, [
        StatisticData(start=start + timedelta(hours=i), mean=float(i), min=0.0, max=10.0) for i in range(24)])
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    await _ws(client, "entities", refresh=True, wait=True)

    pv = await _ws(client, "preview_action", kind="delete_history", entity_ids=["test:foo"], states=False)
    assert pv["success"] and pv["result"]["entities"][0]["does"] == ["clear long-term statistics"]

    refused = await _ws(client, "apply_action", kind="delete_history", entity_ids=["test:foo"], confirm=False)
    assert not refused["success"]
    started = await _ws(client, "apply_action", kind="delete_history", entity_ids=["test:foo"], confirm=True, states=False)
    assert started["result"] == {"started": True}
    st = await _wait_job(client)
    assert st["error"] is None and st["result"] is not None

    info = await _ws(client, "stats_info", statistic_id="test:foo")
    assert info["result"]["exists"] is False

    hist = (await _ws(client, "actions"))["result"]
    act = hist[0]
    assert act["kind"] == "delete_history" and act["status"] == "applied"
    step = act["entities"][0]["steps"]["statistics"]
    assert step["deleted"] is True and step["statistics"] == 24
    assert step["exists"] is True and step["file_bytes"] > 0 and act["backup_files"] == 1 and act["backup_bytes"] == step["file_bytes"]
    usage_b = (await _ws(client, "backup_usage"))["result"]
    assert usage_b["files"] == 1 and usage_b["bytes"] == step["file_bytes"] and usage_b["unlinked_files"] == 0
    assert usage_b["path"].endswith("snapshots")

    # Undo restores from the snapshot, and can only be done once.
    undo = await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    assert undo["result"] == {"started": True}
    st = await _wait_job(client)
    assert st["result"]["status"] == "undone"
    assert (await _ws(client, "stats_info", statistic_id="test:foo"))["result"]["statistics"] == 24
    act2 = (await _ws(client, "actions"))["result"][0]
    assert act2["status"] == "undone" and act2["undone_ts"] and "Restored" in act2["entities"][0]["undo_notes"][0]
    again = await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    assert not again["success"]
    # The restored data is back in the database, so the backup file is gone.
    assert (await _ws(client, "backup_usage"))["result"]["files"] == 0
    assert any("Backup file removed" in n for n in act2["entities"][0]["undo_notes"])
    # The action and the undo each re-read just the entity they touched, so nothing is left marked stale.
    item = next(i for i in hass.data[DOMAIN]["inventory"]["items"] if i["entity_id"] == "test:foo")
    assert not item.get("size_stale") and item["stats_rows"] == 24 and hass.data[DOMAIN]["inventory"]["partial"]["refreshed"] >= 1


async def test_delete_history_records_removes_backups(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    meta = (StatisticMetaData(
        has_mean=True, has_sum=False, name="Test", source="test",
        statistic_id="test:bar", unit_of_measurement="W", mean_type=1, unit_class=None,
    ) if _supports_mean_type() else StatisticMetaData(
        has_mean=True, has_sum=False, name="Test", source="test",
        statistic_id="test:bar", unit_of_measurement="W",
    ))
    async_add_external_statistics(hass, meta, [StatisticData(start=start + timedelta(hours=i), mean=1.0, min=0.0, max=2.0) for i in range(5)])
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    await _ws(client, "apply_action", kind="delete_history", entity_ids=["test:bar"], confirm=True, states=False)
    await _wait_job(client)
    act = (await _ws(client, "actions"))["result"][0]
    assert (await _ws(client, "backup_usage"))["result"]["files"] == 1
    refused = await _ws(client, "delete_actions", action_ids=[act["id"]], confirm=False)
    assert not refused["success"]
    done = await _ws(client, "delete_actions", action_ids=[act["id"], 9999], confirm=True)
    assert done["result"]["deleted"] == 1 and done["result"]["files_removed"] == 1 and done["result"]["bytes_freed"] > 0
    assert act["id"] not in [a["id"] for a in (await _ws(client, "actions"))["result"]]
    assert (await _ws(client, "backup_usage"))["result"]["files"] == 0


async def test_disable_and_clear_states_then_undo(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    from homeassistant.helpers.recorder import session_scope
    from sqlalchemy import text

    await _setup(hass)
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "test", "uid9", suggested_object_id="noisy")
    for i in range(12):
        hass.states.async_set("sensor.noisy", str(i), {"i": i, "unit": "x"})
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    await _ws(client, "entities", refresh=True, wait=True)       # builds the inventory the preview uses

    def state_rows() -> int:
        with session_scope(hass=hass, read_only=True) as s:
            return s.execute(text("SELECT COUNT(*) FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id "
                                  "WHERE m.entity_id = 'sensor.noisy'")).scalar()

    from homeassistant.components.recorder import get_instance
    assert await get_instance(hass).async_add_executor_job(state_rows) >= 12

    pv = (await _ws(client, "preview_action", kind="disable_and_clear", entity_ids=["sensor.noisy", "sensor.ghost"]))["result"]
    by = {e["entity_id"]: e for e in pv["entities"]}
    assert "disable" in by["sensor.noisy"]["does"] and "clear state history" in by["sensor.noisy"]["does"]
    assert any("registry" in n for n in by["sensor.ghost"]["notes"])

    await _ws(client, "apply_action", kind="disable_and_clear", entity_ids=["sensor.noisy"], confirm=True)
    st = await _wait_job(client)
    assert st["error"] is None
    assert registry.async_get("sensor.noisy").disabled_by == er.RegistryEntryDisabler.USER
    assert await get_instance(hass).async_add_executor_job(state_rows) == 0

    act = (await _ws(client, "actions"))["result"][0]
    assert act["status"] == "applied" and act["entities"][0]["steps"]["disabled"]["changed"] is True
    assert act["entities"][0]["steps"]["states"]["purged"] is True

    await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    await _wait_job(client)
    assert registry.async_get("sensor.noisy").disabled_by is None
    undone = (await _ws(client, "actions"))["result"][0]
    assert any("12 state rows" in n for n in undone["entities"][0]["undo_notes"])
    assert await get_instance(hass).async_add_executor_job(state_rows) == 12   # the history is back
    def attr_rows() -> int:
        with session_scope(hass=hass, read_only=True) as s:
            return s.execute(text("SELECT COUNT(*) FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id "
                                  "JOIN state_attributes a ON a.attributes_id = s.attributes_id "
                                  "WHERE m.entity_id = 'sensor.noisy' AND a.shared_attrs LIKE '%\"unit\"%'")).scalar()
    assert await get_instance(hass).async_add_executor_job(attr_rows) == 12    # with their attributes
    assert (await _ws(client, "backup_usage"))["result"]["files"] == 0         # backup removed after a clean undo

    # Disabling something the user already disabled changes nothing and is not undone later.
    registry.async_update_entity("sensor.noisy", disabled_by=er.RegistryEntryDisabler.USER)
    await _ws(client, "apply_action", kind="disable", entity_ids=["sensor.noisy", "sensor.ghost"], confirm=True)
    await _wait_job(client)
    act = (await _ws(client, "actions"))["result"][0]
    notes = {e["entity_id"]: e["notes"] for e in act["entities"]}
    assert "Was already disabled." in notes["sensor.noisy"] and any("registry" in n for n in notes["sensor.ghost"])


def test_journal_actions_roundtrip(tmp_path) -> None:
    from custom_components.db_storage_manager.journal import Journal

    j = Journal(tmp_path / "j.db")
    j.setup()
    a = j.add_action(1.0, "disable", "Disable: 1 entity", [{"entity_id": "sensor.a", "ok": True}], 0)
    assert j.get_action(a)["status"] == "running"
    assert j.mark_interrupted() == 1 and j.get_action(a)["status"] == "interrupted"
    j.update_action(a, status="applied", entities=[{"entity_id": "sensor.a", "ok": True, "steps": {}}])
    b = j.add_action(2.0, "delete_history", "x", [], 10)
    assert [r["id"] for r in j.list_actions()] == [b, a]
    assert j.get_action(a)["entities"][0]["steps"] == {}
    import pytest
    with pytest.raises(ValueError):
        j.update_action(a, kind="oops")


async def test_entity_rows_ws_returns_state_and_attributes(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    for i in range(7):
        hass.states.async_set("sensor.pages", str(i), {"unit_of_measurement": "W", "friendly_name": "Pages", "n": i})
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    p1 = (await _ws(client, "entity_rows", entity_id="sensor.pages", limit=3))["result"]
    assert p1["total"] == 7 and [r["state"] for r in p1["rows"]] == ["6", "5", "4"]
    assert p1["rows"][0]["attributes"]["unit_of_measurement"] == "W" and p1["next"] is not None
    p2 = (await _ws(client, "entity_rows", entity_id="sensor.pages", limit=3, cursor=p1["next"]))["result"]
    assert [r["state"] for r in p2["rows"]] == ["3", "2", "1"] and p2["total"] is None
    p3 = (await _ws(client, "entity_rows", entity_id="sensor.pages", limit=3, cursor=p2["next"]))["result"]
    assert [r["state"] for r in p3["rows"]] == ["0"] and p3["next"] is None
    empty = (await _ws(client, "entity_rows", entity_id="sensor.pages", kind="statistics"))["result"]
    assert empty["rows"] == [] and empty["total"] == 0
    bad = await _ws(client, "entity_rows", entity_id="sensor.pages", kind="events")
    assert not bad["success"]


async def test_batch_backup_is_one_file_for_all_entities(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    from homeassistant.components.recorder import get_instance
    from homeassistant.helpers.recorder import session_scope
    from sqlalchemy import text
    await _setup(hass)
    registry = er.async_get(hass)
    for n in ("one", "two"):
        registry.async_get_or_create("sensor", "test", f"uid-{n}", suggested_object_id=n)
        for i in range(5):
            hass.states.async_set(f"sensor.{n}", str(i), {"k": n})
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    await _ws(client, "entities", refresh=True, wait=True)
    await _ws(client, "apply_action", kind="delete_history", entity_ids=["sensor.one", "sensor.two"], confirm=True, states=True)
    st = await _wait_job(client)
    assert st["error"] is None
    assert (await _ws(client, "backup_usage"))["result"]["files"] == 1          # one file, both entities
    act = (await _ws(client, "actions"))["result"][0]
    assert act["backup_files"] == 1
    names = {e["steps"]["states"]["backup"] for e in act["entities"]}
    assert len(names) == 1 and {e["steps"]["states"]["rows"] for e in act["entities"]} == {5}
    await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    assert (await _wait_job(client))["result"]["status"] == "undone"

    def rows() -> int:
        with session_scope(hass=hass, read_only=True) as s:
            return s.execute(text("SELECT COUNT(*) FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id "
                                  "WHERE m.entity_id IN ('sensor.one','sensor.two')")).scalar()
    assert await get_instance(hass).async_add_executor_job(rows) == 10


async def _retention_fixture(hass):
    """sensor.old has 5 rows three days old and 2 rows now (the old ones are back-dated in the database)."""
    from homeassistant.components.recorder import get_instance
    from homeassistant.helpers.recorder import session_scope
    from sqlalchemy import text
    await _setup(hass)
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "test", "uid-old", suggested_object_id="old")
    for i in range(7):
        hass.states.async_set("sensor.old", f"s{i}", {"k": i})
    await async_wait_recording_done(hass)

    def backdate() -> None:
        with session_scope(session=get_instance(hass).get_session()) as s:
            ids = [r[0] for r in s.execute(text("SELECT s.state_id FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id WHERE m.entity_id = 'sensor.old' ORDER BY s.state_id LIMIT 5"))]
            s.execute(text(f"UPDATE states SET last_updated_ts = last_updated_ts - 259200 WHERE state_id IN ({','.join(map(str, ids))})"))
    await get_instance(hass).async_add_executor_job(backdate)


def _count(hass):
    from homeassistant.helpers.recorder import session_scope
    from sqlalchemy import text

    def rows() -> int:
        with session_scope(hass=hass, read_only=True) as s:
            return s.execute(text("SELECT COUNT(*) FROM states s JOIN states_meta m ON m.metadata_id = s.metadata_id "
                                  "WHERE m.entity_id = 'sensor.old'")).scalar()
    from homeassistant.components.recorder import get_instance
    return get_instance(hass).async_add_executor_job(rows)


async def test_reduce_retention_deletes_old_rows_with_backup_and_undo(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _retention_fixture(hass)
    client = await hass_ws_client(hass)
    await _ws(client, "entities", refresh=True, wait=True)
    pv = (await _ws(client, "preview_action", kind="reduce_retention", entity_ids=["sensor.old"], keep_days=1))["result"]
    assert pv["entities"][0]["rows"] == 5 and pv["default_days"] >= 1
    assert "no_stats" in pv["warnings"] and pv["entities"][0]["no_stats"]      # a text-like sensor: no statistics to fall back on
    no_effect = (await _ws(client, "preview_action", kind="reduce_retention", entity_ids=["sensor.old"], keep_days=pv["default_days"]))["result"]
    assert "no_effect" in no_effect["warnings"]
    assert await _count(hass) == 7
    await _ws(client, "apply_action", kind="reduce_retention", entity_ids=["sensor.old"], keep_days=1, confirm=True)
    assert (await _wait_job(client))["error"] is None
    assert await _count(hass) == 2                                         # the three-day-old rows are gone
    assert retention.rules(hass) == {"sensor.old": 1}
    listed = (await _ws(client, "entities", wait=True))["result"]["items"]
    assert [i["retention"] for i in listed if i["entity_id"] == "sensor.old"] == ["1 day"]
    act = (await _ws(client, "actions"))["result"][0]
    assert act["status"] == "applied" and act["backup_files"] == 1
    await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    assert (await _wait_job(client))["result"]["status"] == "undone"
    assert await _count(hass) == 7 and retention.rules(hass) == {}         # restored, rule removed


async def test_nightly_retention_run_and_reset(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _retention_fixture(hass)
    client = await hass_ws_client(hass)
    await retention.async_set_rule(hass, "sensor.old", 1)
    events = []
    hass.bus.async_listen(f"{DOMAIN}_retention_run", events.append)
    res = (await _ws(client, "retention_run", confirm=True))["result"]
    await hass.async_block_till_done()
    assert res["rows"] == 5 and await _count(hass) == 2
    assert events and events[0].data["rows"] == 5 and events[0].data["rules"] == 1       # visible to automations
    assert hass.states.get("sensor.db_storage_manager_retention_rules").state == "1"
    assert hass.states.get("sensor.db_storage_manager_retention_last_run").attributes["rows_deleted"] == 5
    acts = (await _ws(client, "actions"))["result"]
    assert acts[0]["kind"] == "retention_run" and acts[0]["entities"][0]["steps"]["states"]["rows"] == 5
    assert (await _ws(client, "retention_run", confirm=True))["result"]["rows"] == 0          # nothing left, nothing logged
    await hass.services.async_call(DOMAIN, "run_retention", {}, blocking=True)               # the service does the same
    assert (await _ws(client, "retention_status"))["result"]["run_at"] == "04:35"
    assert (await _ws(client, "retention_status"))["result"]["rules"] == 1
    await _ws(client, "apply_action", kind="reset_retention", entity_ids=["sensor.old"], confirm=True)
    assert (await _wait_job(client))["error"] is None and retention.rules(hass) == {}
    act = (await _ws(client, "actions"))["result"][0]
    await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    await _wait_job(client)
    assert retention.rules(hass) == {"sensor.old": 1}


async def test_retention_runs_as_a_maintained_automation(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    import os
    from homeassistant.helpers import category_registry as cr
    from custom_components.db_storage_manager import automation_sync
    cfg = hass.config.path("automations.yaml")
    with open(hass.config.path("configuration.yaml"), "w") as fh:
        fh.write("automation: !include automations.yaml\n")
    with open(cfg, "w") as fh:
        fh.write("- id: mine\n  alias: Mine\n  triggers: []\n  actions: []\n")
    assert await async_setup_component(hass, "automation", {"automation": {"id": "mine", "alias": "Mine", "triggers": [], "actions": []}})
    try:
        await _retention_fixture(hass)
        await retention.async_set_rule(hass, "sensor.old", 1)
        await hass.async_block_till_done()                                       # the rule change rewrote the automation itself
        assert "keep_days: 1" in open(cfg).read()
        assert await automation_sync.async_sync(hass, True, "05:10:00") == "automation"
        text = open(cfg).read()
        assert "db_storage_retention" in text and "05:10:00" in text and "id: mine" in text            # ours added, theirs kept
        assert "action: recorder.purge_entities" in text and "- sensor.old" in text      # one visible purge step per retention setting
        info = automation_sync.info(hass)
        assert info["link"] == "/config/automation/edit/db_storage_retention" and info["on"]
        reg = er.async_get(hass).async_get(info["entity_id"])
        cat = next(c for c in cr.async_get(hass).async_list_categories(scope="automation") if c.name == "DB Storage")
        assert reg.categories == {"automation": cat.category_id}
        client = await hass_ws_client(hass)
        st = (await _ws(client, "retention_status"))["result"]
        assert st["automation"]["entity_id"] == info["entity_id"]
        run = (await _ws(client, "retention_run", confirm=True))["result"]                              # runs the automation itself
        assert run["via"] == "automation" and run["rows"] == 5 and await _count(hass) == 2
        assert await automation_sync.async_sync(hass, True, "06:00:00") == "automation" and "06:00:00" in open(cfg).read()
        assert await automation_sync.async_sync(hass, False, "06:00:00") == "off"
        assert "db_storage_retention" not in open(cfg).read() and "id: mine" in open(cfg).read()
        assert automation_sync.info(hass) is None
        assert (await _ws(client, "retention_run", confirm=True))["result"]["via"] == "direct"          # no automation: runs the job itself
    finally:
        os.remove(cfg)
        os.remove(hass.config.path("configuration.yaml"))


async def test_disabling_drops_the_retention_rule_and_undo_restores_it(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "test", "uid-r", suggested_object_id="ruled")
    hass.states.async_set("sensor.ruled", "1")
    await retention.async_set_rule(hass, "sensor.ruled", 2)
    client = await hass_ws_client(hass)
    pv = (await _ws(client, "preview_action", kind="disable", entity_ids=["sensor.ruled"], states=False))["result"]
    assert "remove its retention rule" in pv["entities"][0]["does"]
    await _ws(client, "apply_action", kind="disable", entity_ids=["sensor.ruled"], states=False, confirm=True)
    await _wait_job(client)
    assert retention.rules(hass) == {} and registry.async_get("sensor.ruled").disabled_by == er.RegistryEntryDisabler.USER
    act = (await _ws(client, "actions"))["result"][0]
    assert act["entities"][0]["steps"]["retention"] == {"old": 2, "new": None}
    await _ws(client, "undo_action", action_id=act["id"], confirm=True)
    await _wait_job(client)
    assert retention.rules(hass) == {"sensor.ruled": 2} and registry.async_get("sensor.ruled").disabled_by is None


async def test_rules_for_entities_that_no_longer_exist_are_pruned(recorder_mock, enable_custom_integrations, hass) -> None:
    await _setup(hass)
    registry = er.async_get(hass)
    registry.async_get_or_create("sensor", "test", "uid-k", suggested_object_id="kept")
    hass.states.async_set("sensor.live", "1")
    for eid in ("sensor.kept", "sensor.live", "sensor.gone"):
        await retention.async_set_rule(hass, eid, 1)
    assert await retention.async_prune(hass) == ["sensor.gone"]
    assert set(retention.rules(hass)) == {"sensor.kept", "sensor.live"}
    await retention.async_count(hass)           # the nightly job prunes too
    registry.async_remove("sensor.kept")
    hass.states.async_remove("sensor.live")
    await retention.async_count(hass)
    assert retention.rules(hass) == {}


async def test_partial_rescan_refreshes_only_changed_and_new_entities(recorder_mock, enable_custom_integrations, hass, hass_ws_client) -> None:
    await _setup(hass)
    hass.states.async_set("sensor.keep", "1")
    hass.states.async_set("sensor.touched", "1")
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    first = (await _ws(client, "entities", refresh=True, wait=True))["result"]
    assert all("states_w" in i for i in hass.data[DOMAIN]["inventory"]["items"]) and first["stale_count"] == 0
    keep_rows = next(i for i in first["items"] if i["entity_id"] == "sensor.keep")["states_rows"]
    # More data arrives for both, and a brand new entity appears.
    for n in range(2, 6):
        hass.states.async_set("sensor.keep", str(n))
        hass.states.async_set("sensor.touched", str(n))
    hass.states.async_set("sensor.fresh", "1")
    await async_wait_recording_done(hass)
    inv = hass.data[DOMAIN]["inventory"]
    next(i for i in inv["items"] if i["entity_id"] == "sensor.touched")["size_stale"] = True
    from custom_components.db_storage_manager import websocket as ws_mod

    await ws_mod._do_scan(hass, ws_mod._new_progress(), full=False)   # what runs after an action
    res = (await _ws(client, "entities"))["result"]
    by = {i["entity_id"]: i for i in res["items"]}
    assert by["sensor.touched"]["states_rows"] > 1 and not by["sensor.touched"].get("size_stale")
    assert "sensor.fresh" in by                                    # new since the last scan
    assert by["sensor.keep"]["states_rows"] == keep_rows           # left alone
    assert res["partial"]["new"] >= 1 and res["partial"]["refreshed"] >= 2
    tables = sum(t["bytes"] or 0 for t in res["tables"] if t["table"] in ("states", "states_meta"))
    assert abs(sum(i["states_bytes"] for i in res["items"]) - tables) <= len(res["items"])  # still adds up
    full = (await _ws(client, "entities", refresh=True, wait=True))["result"]
    assert next(i for i in full["items"] if i["entity_id"] == "sensor.keep")["states_rows"] > keep_rows
    assert full["partial"] is None


async def test_saved_scan_from_an_older_scan_version_is_redone(recorder_mock, enable_custom_integrations, hass, hass_ws_client, monkeypatch) -> None:
    from custom_components.db_storage_manager import inventory_store, websocket as ws_mod

    await _setup(hass)
    hass.states.async_set("sensor.v", "1")
    await async_wait_recording_done(hass)
    client = await hass_ws_client(hass)
    await _ws(client, "entities", refresh=True, wait=True)           # saves inventory.json.gz
    hass.data[DOMAIN].pop("inventory")
    await ws_mod.async_load_inventory(hass)
    assert hass.data[DOMAIN]["inventory"]["from_disk"] and not hass.data[DOMAIN].get("rescan_needed")
    hass.data[DOMAIN].pop("inventory")
    monkeypatch.setattr(inventory_store, "SCAN_VERSION", inventory_store.SCAN_VERSION + 1)   # a release that changes the scan
    await ws_mod.async_load_inventory(hass)
    assert "inventory" not in hass.data[DOMAIN] and hass.data[DOMAIN]["rescan_needed"] is True
