"""Usage scanning: matching, UUID mapping, YAML splitting, dynamic detection, labels."""

from __future__ import annotations

import sys
from pathlib import Path

PKG = Path(__file__).parent.parent / "custom_components" / "db_storage_manager"


def _load(name):
    import importlib.util

    spec = importlib.util.spec_from_file_location(name, PKG / f"{name}.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


usage = _load("usage")
facets = _load("facets")

IDS = {"sensor.solar_power", "sensor.solar_power_total", "cover.garage", "light.hall", "sensor.old_thing"}
UUID = "0123456789abcdef0123456789abcdef"
M = usage.Matcher(IDS, {UUID: "light.hall"})


def test_matcher_exact_ids_not_prefixes():
    assert M.find("state: sensor.solar_power_total > 3") == {"sensor.solar_power_total"}
    assert M.find("{{ states('sensor.solar_power') }}") == {"sensor.solar_power"}
    assert M.find("states.cover.garage.state") == {"cover.garage"}
    assert M.find("sensor.unknown_one and notsensor.solar_power") == set()
    assert M.find(f"entity_id: {UUID}") == {"light.hall"}  # UI automations use registry ids


SPLIT_AUTOMATIONS = """\
- id: '1700000000001'
  alias: Garage at night
  triggers:
  - trigger: state
    entity_id: cover.garage
  actions: []
- id: '1700000000002'
  alias: Hall on
  actions:
  - action: light.turn_on
    target:
      entity_id: %s
""" % UUID

SCRIPTS = """\
night_mode:
  alias: Night mode
  sequence:
  - action: light.turn_off
    target:
      entity_id: light.hall
other:
  sequence: []
"""


def test_split_and_scan_automations():
    lines = SPLIT_AUTOMATIONS.splitlines()
    items = usage.split_yaml_items(lines, "list")
    assert [(i["name"], i["id"]) for i in items] == [("Garage at night", "1700000000001"), ("Hall on", "1700000000002")]
    hits, _ = usage.scan_lines(M, lines[items[0]["start"]:items[0]["end"]], items[0]["start"] + 1)
    assert hits == {"cover.garage": ["line 5"]}
    hits2, _ = usage.scan_lines(M, lines[items[1]["start"]:items[1]["end"]], items[1]["start"] + 1)
    assert "light.hall" in hits2


def test_split_scripts():
    items = usage.split_yaml_items(SCRIPTS.splitlines(), "dict")
    assert [(i["name"], i["id"]) for i in items] == [("Night mode", "night_mode"), ("other", "other")]


def test_comments_ignored():
    hits, _ = usage.scan_lines(M, ["# sensor.old_thing was removed", "entity_id: light.hall"])
    assert list(hits) == ["light.hall"]


def test_dynamic_detection():
    dyn = usage.dynamic_in("{{ expand(area_entities('lounge')) | list }} {{ states.sensor | list }} {{ 'sensor.' ~ x }}")
    assert {"expand()", "area_entities()", "states.sensor", "built entity id"} <= dyn
    assert usage.dynamic_in("{{ states.sensor.foo.state }}") == set()  # literal id, not domain-wide
    assert usage.dynamic_in("{{ states('sensor.x') }}") == set()


DASH = {"views": [{"title": "Energy", "cards": [{"type": "gauge", "entity": "sensor.solar_power"},
                                                 {"type": "entities", "entities": ["cover.garage"]}]},
                  {"path": "lights", "cards": [{"type": "button", "entity": "light.hall"}]}]}


def test_lovelace_labels():
    hits, _ = usage.scan_json(M, DASH, usage.lovelace_label)
    assert hits["sensor.solar_power"] == ['view "Energy" > card gauge']
    assert hits["cover.garage"] == ['view "Energy" > card entities']
    assert hits["light.hall"] == ['view "lights" > card button']


def test_usage_summary_and_domain_wide():
    u = usage.Usage()
    u.add("Dashboard", "Home", "/lovelace/0", {"sensor.solar_power": ["view x"]})
    u.add("Automation", "Solar alert", "/config/automation/edit/1", {"sensor.solar_power": ["line 3"], "cover.garage": ["line 9"]})
    u.add("Automation", "Solar alert", "/config/automation/edit/1", {"sensor.solar_power": ["line 12"]})  # a second reference in the same automation
    u.add_dynamic("Automation", "Everything report", None, {"states.sensor"})
    s = u.summary("sensor.solar_power", "sensor")
    assert s["used_in"] == ["Automation", "Dashboard"] and s["used_count"] == 3 and s["dynamic_possible"] == 1   # every reference counts
    none = u.summary("sensor.old_thing", "sensor")
    assert none["used_in"] == ["Not referenced"] and none["used_count"] == 0
    assert u.summary("light.hall", "light")["dynamic_possible"] == 0


def test_used_in_facet_is_multivalued():
    items = [
        {"entity_id": "a", "used_in": ["Automation", "Dashboard"], "total_bytes": 10, "status": "Active", "domain": "x",
         "integration": "i", "device": "d", "age": "This week"},
        {"entity_id": "b", "used_in": ["Not referenced"], "total_bytes": 30, "status": "Active", "domain": "x",
         "integration": "i", "device": "d", "age": "This week"},
    ]
    f = {r["value"]: r["bytes"] for r in facets.build_facets(items)["used_in"]}
    assert f == {"Not referenced": 30, "Automation": 10, "Dashboard": 10}
    out = facets.apply_filters(items, {"used_in": ["Not referenced"]})
    assert [i["entity_id"] for i in out] == ["b"]


def test_yaml_escape_in_alias_is_decoded():
    lines = ['- id: "1"', '  alias: "Heat water in day if it\'s \\U0001F976"', '  action: []']
    items = usage.split_yaml_items(lines, "list")
    assert items[0]["name"] == "Heat water in day if it's \U0001F976"


def test_merge_locations_counts_entities_per_place():
    u = usage.Usage()
    u.add("Automation", "Vent", "/config/automation/edit/1", {"sensor.a": ["line 5"], "sensor.b": ["line 9"]})
    u.add("Automation", "Other", "/config/automation/edit/2", {"sensor.a": ["line 3"]})
    merged = usage.merge_locations(u, ["sensor.a", "sensor.b"])
    by = {m["name"]: m for m in merged}
    assert by["Vent"]["count"] == 2 and by["Vent"]["where"] == "line 5, line 9"
    assert by["Other"]["count"] == 1 and len(merged) == 2


def test_every_card_reference_counts_but_not_every_field():
    m = usage.Matcher({"sensor.t"})
    conf = {"views": [{"title": "V", "cards": [
        {"type": "gauge", "entity": "sensor.t", "name": "sensor.t"},          # two fields, one card
        {"type": "gauge", "entity": "sensor.t"},                              # a second identical-looking card
        {"type": "entities", "entities": ["sensor.t"]}]}]}
    hits, _ = usage.scan_json(matcher=m, obj=conf, label=usage.lovelace_label)
    assert len(hits["sensor.t"]) == 3
    u = usage.Usage()
    u.add("Dashboard", "Main", "/lovelace/0", hits, group_meta=usage.view_meta(conf, None))
    assert u.summary("sensor.t", "sensor")["used_count"] == 3
    assert "x2" in u.locations["sensor.t"][0]["where"]


def test_yaml_defined_entities_are_found_by_name_or_unique_id():
    from custom_components.db_storage_manager.usage import Matcher, scan_lines
    m = Matcher({"sensor.db_size", "sensor.cmd_temp", "sensor.other"}, {}, {"cmd-temp-1": "sensor.cmd_temp"}, {"db_size": ["sensor.db_size"]})
    lines = ["sql:", "  - name: DB size", "    query: select 1", "command_line:", "  - sensor:", "      name: Not it", "      unique_id: cmd-temp-1", "# name: DB size"]
    hits, _ = scan_lines(m, lines, defs=True)
    assert hits == {"sensor.db_size": ["line 2 (defined here)"], "sensor.cmd_temp": ["line 7 (defined here)"]}
    assert scan_lines(m, lines)[0] == {}                      # only YAML config files are read this way
