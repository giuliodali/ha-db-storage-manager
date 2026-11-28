"""Collect usage sources from a running Home Assistant. Read-only."""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .const import LEGACY_RETENTION_AUTOMATION_ID
from .usage import (
    Matcher, Usage, current_cost_sensors, dynamic_in, lovelace_label, scan_json, scan_lines, split_yaml_items, view_meta,
)

_LOGGER = logging.getLogger(__name__)

SKIP_DIRS = {"custom_components", ".storage", "deps", "backups", ".git", "www", "tts", "__pycache__",
             "node_modules", ".cloud", "blueprints", "image", "media", "share", "ssl", ".venv", "venv"}
SKIP_FILES = {"secrets.yaml"}
MAX_FILE_BYTES = 2_000_000
MAX_FILES = 600

HELPER_DOMAINS = {
    "template", "group", "derivative", "integration", "utility_meter", "threshold", "min_max",
    "statistics", "history_stats", "trend", "filter", "generic_thermostat", "generic_hygrostat",
    "switch_as_x", "random", "compensation", "mold_indicator", "tod", "bayesian", "sql",
}
SPECIAL_YAML = {
    "automations.yaml": ("Automation", "list", "/config/automation/edit/{id}"),
    "scenes.yaml": ("Scene", "list", "/config/scene/edit/{id}"),
    "scripts.yaml": ("Script", "dict", "/config/script/edit/{id}"),
}


def scan_yaml_dir(config_dir: str, matcher: Matcher, usage: Usage, skip_ids: frozenset[str] = frozenset()) -> None:
    """Blocking: walks the config folder. Run in an executor."""
    seen = 0
    for root, dirs, files in os.walk(config_dir):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
        for fname in sorted(files):
            if not fname.endswith((".yaml", ".yml")) or fname in SKIP_FILES:
                continue
            path = Path(root) / fname
            seen += 1
            if seen > MAX_FILES:
                return
            try:
                if path.stat().st_size > MAX_FILE_BYTES:
                    continue
                lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
            except OSError:
                continue
            rel = str(path.relative_to(config_dir))
            special = SPECIAL_YAML.get(fname) if root == config_dir else None
            if special:
                kind, style, link_fmt = special
                for item in split_yaml_items(lines, style):
                    if item["id"] in skip_ids:
                        continue  # disabled in the entity registry, so it uses nothing
                    if kind == "Automation" and item["id"] == LEGACY_RETENTION_AUTOMATION_ID:
                        continue  # the nightly automation older versions wrote names every entity with a rule, so it is not a real reference
                    chunk = lines[item["start"]:item["end"]]
                    hits, dyn = scan_lines(matcher, chunk, item["start"] + 1)
                    link = link_fmt.format(id=item["id"]) if item["id"] else None
                    usage.add(kind, item["name"], link, hits)
                    usage.add_dynamic(kind, item["name"], link, dyn)
            else:
                hits, dyn = scan_lines(matcher, lines, defs=True)
                usage.add("YAML config", rel, None, hits)
                usage.add_dynamic("YAML config", rel, None, dyn)


async def _scan_dashboards(hass: HomeAssistant, matcher: Matcher, usage: Usage) -> None:
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA  # noqa: PLC0415
    except ImportError:
        return
    data = hass.data.get(LOVELACE_DATA)
    if data is None:
        return
    for url_path, dash in data.dashboards.items():
        try:
            conf = await dash.async_load(False)
        except Exception:  # noqa: BLE001 - auto-generated or YAML errors
            continue
        info = getattr(dash, "config", None) or {}
        name = info.get("title") or (conf.get("title") if isinstance(conf, dict) else None) or (url_path or "Overview")
        link = f"/{url_path}" if url_path else "/lovelace/0"
        hits, dyn = scan_json(matcher, conf, lovelace_label)
        usage.add("Dashboard", str(name), link, hits, group_meta=view_meta(conf, url_path))
        usage.add_dynamic("Dashboard", str(name), link, dyn)


def disabled_sources(hass: HomeAssistant) -> tuple[set[str], frozenset[str]]:
    """Things that are switched off, so what they reference does not count as used.

    Returns (config entry ids, automation/script/scene ids). An automation counts as off when it is disabled or turned off. A config entry is off when it is disabled
    itself or when every entity it owns is disabled (a template helper whose sensor you disabled, say).
    """
    reg = er.async_get(hass)
    by_entry: dict[str, list[er.RegistryEntry]] = {}
    for ent in reg.entities.values():
        if ent.config_entry_id:
            by_entry.setdefault(ent.config_entry_id, []).append(ent)
    entries = {e.entry_id for e in hass.config_entries.async_entries()
               if e.disabled_by is not None or (by_entry.get(e.entry_id) and all(x.disabled_by is not None for x in by_entry[e.entry_id]))}
    def off(ent: er.RegistryEntry) -> bool:
        if ent.disabled_by is not None:
            return True
        st = hass.states.get(ent.entity_id) if ent.platform == "automation" else None
        return st is not None and st.state == "off"   # an automation you turned off in the UI is still enabled in the registry

    yaml_ids = frozenset(str(ent.unique_id) for ent in reg.entities.values()
                         if ent.platform in ("automation", "script", "scene") and ent.unique_id and off(ent))
    return entries, yaml_ids


def _scan_config_entries(hass: HomeAssistant, matcher: Matcher, usage: Usage, own_entry_ids: set[str],
                         skip_entries: set[str] = frozenset()) -> None:
    for entry in hass.config_entries.async_entries():
        if entry.entry_id in own_entry_ids or entry.entry_id in skip_entries:
            continue
        # Only the key paths of matches are recorded, never values, so secrets stay out.
        payload = {"data": dict(entry.data), "options": dict(entry.options)}
        hits, dyn = scan_json(matcher, payload)
        kind = "Helper" if entry.domain in HELPER_DOMAINS else "Integration config"
        name = f"{entry.title} ({entry.domain})"
        link = "/config/helpers" if kind == "Helper" else f"/config/integrations/integration/{entry.domain}"
        usage.add(kind, name, link, hits)
        usage.add_dynamic(kind, name, link, dyn)


async def _scan_energy(hass: HomeAssistant, matcher: Matcher, usage: Usage) -> None:
    """The Energy dashboard's configuration, through the energy integration's own manager.

    Besides the entities its configuration names, every statistic it names (including imported ones,
    which are not entity ids) and the cost sensors the energy integration still creates for it count as used
    by the Energy dashboard. A cost sensor left over from a source that was removed does not. The Settings page keeps exactly this set under its own statistics limit.
    """
    if "energy" not in hass.config.components:
        return
    from homeassistant.components.energy.data import async_get_manager  # noqa: PLC0415

    from .settings import stat_ids_in  # noqa: PLC0415

    try:
        data = (await async_get_manager(hass)).data
    except Exception:  # noqa: BLE001
        return
    hits, dyn = scan_json(matcher, data) if data else ({}, set())
    for sid in stat_ids_in(data or {}):
        if sid not in hits:  # imported statistics (source:id) are not entity ids, so the text match misses them
            hits[sid] = ["statistic"]
    reg = er.async_get(hass)
    costs = current_cost_sensors([(e.entity_id, e.unique_id) for e in reg.entities.values() if e.platform == "energy"],
                                 {e.id: e.entity_id for e in reg.entities.values()}, set(hits) | set(stat_ids_in(data or {})))
    for cost_id, source in costs.items():  # only those whose source is still in the Energy configuration
        hits.setdefault(cost_id, []).append(f"cost sensor for {source}")
    if hits or dyn:
        usage.add("Energy dashboard", "Energy configuration", "/config/energy", hits)
        usage.add_dynamic("Energy dashboard", "Energy configuration", "/config/energy", dyn)


async def collect_usage(hass: HomeAssistant, matcher: Matcher, own_entry_ids: set[str]) -> Usage:
    usage = Usage()
    skip_entries, skip_yaml = disabled_sources(hass)
    await hass.async_add_executor_job(scan_yaml_dir, hass.config.config_dir, matcher, usage, skip_yaml)
    await _scan_dashboards(hass, matcher, usage)
    _scan_config_entries(hass, matcher, usage, own_entry_ids, skip_entries)
    await _scan_energy(hass, matcher, usage)
    return usage
