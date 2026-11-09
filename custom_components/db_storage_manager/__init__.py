"""DB Storage Manager: M0 spike. Registers a sidebar panel and admin WebSocket commands."""

from __future__ import annotations

import logging
from typing import Any
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers.event import async_track_time_change, async_track_time_interval
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.start import async_at_started

from .const import (CONF_RETENTION_ENABLED, CONF_RETENTION_TIME, CONF_SAMPLE_INTERVAL, DEFAULT_RETENTION_TIME, DEFAULT_SAMPLE_INTERVAL,
                    DOMAIN, PANEL_URL_PATH, SAMPLE_INTERVALS, STATIC_URL, VERSION)
from .journal import Journal
from .sampler import SizeSampler
from . import automation_sync, retention
from .websocket import async_load_inventory, async_register_commands, start_scan

PLATFORMS = [Platform.SENSOR]

_LOGGER = logging.getLogger(__name__)


def _interval_s(entry: ConfigEntry) -> int:
    return SAMPLE_INTERVALS.get(entry.options.get(CONF_SAMPLE_INTERVAL, DEFAULT_SAMPLE_INTERVAL), 86400)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    state = hass.data.setdefault(DOMAIN, {})
    if not state.get("static_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(Path(__file__).parent / "frontend"), False)]
        )
        async_register_commands(hass)
        state["static_registered"] = True

    journal = Journal(Path(hass.config.path("db_storage_manager", "journal.db")))
    await hass.async_add_executor_job(journal.setup)
    await hass.async_add_executor_job(journal.mark_interrupted)
    sampler = SizeSampler(hass, journal, _interval_s(entry))
    last_row = await hass.async_add_executor_job(journal.last_row)
    if last_row:  # sensors show the last recorded snapshot straight after a restart
        sampler.last_recorded = last_row["ts"]
        sampler.last = last_row
    state["journal"] = journal
    state["sampler"] = sampler
    await async_load_inventory(hass)
    await retention.async_load(hass)

    async def _apply_retention(e: ConfigEntry) -> None:
        """Keep the maintained automation in step with the options; schedule the job ourselves only if it cannot exist."""
        if (unsub := state.pop("retention_unsub", None)):
            unsub()
        retention.configure(hass, e.options.get(CONF_RETENTION_ENABLED, True), e.options.get(CONF_RETENTION_TIME, DEFAULT_RETENTION_TIME))
        cfg = state["retention_cfg"]
        mode = await automation_sync.async_sync(hass, cfg["enabled"], f"{cfg['hour']:02d}:{cfg['minute']:02d}:00")
        state["retention_mode"] = mode
        if mode == "unavailable" and cfg["enabled"]:
            state["retention_unsub"] = async_track_time_change(hass, retention.async_run, hour=cfg["hour"], minute=cfg["minute"], second=0)
        retention._notify()

    retention.configure(hass, entry.options.get(CONF_RETENTION_ENABLED, True), entry.options.get(CONF_RETENTION_TIME, DEFAULT_RETENTION_TIME))
    entry.async_on_unload(lambda: state.pop("retention_unsub", lambda: None)())

    async def _run_retention_service(call: ServiceCall) -> None:
        mode = call.data.get("mode", "all")
        if mode == "count":
            await retention.async_count(hass)
        elif mode == "record":
            await retention.async_record(hass)
        else:
            await retention.async_run(hass)

    # The automation lists one purge step per retention setting, so rewrite it when the rules change.
    rules_seen = [dict(retention.rules(hass))]

    @callback
    def _apply_later(_now: Any) -> None:
        state.pop("apply_debounce", None)
        hass.async_create_task(_apply_retention(entry))

    def _rules_changed() -> None:
        if retention.rules(hass) != rules_seen[0]:
            rules_seen[0] = dict(retention.rules(hass))
            # A bulk action changes many rules in a row: wait for it to settle and write the file once.
            if (cancel := state.pop("apply_debounce", None)):
                cancel()
            state["apply_debounce"] = async_call_later(hass, 3, _apply_later)

    entry.async_on_unload(lambda: (state.pop("apply_debounce", None) or (lambda: None))())

    entry.async_on_unload(retention.add_listener(_rules_changed))

    hass.services.async_register(DOMAIN, "run_retention", _run_retention_service)
    entry.async_on_unload(lambda: hass.services.async_remove(DOMAIN, "run_retention"))

    entry.async_on_unload(async_track_time_interval(hass, sampler.async_tick, timedelta(hours=1)))

    async def _options_updated(_hass: HomeAssistant, updated: ConfigEntry) -> None:
        sampler.interval_s = _interval_s(updated)
        await _apply_retention(updated)

    entry.async_on_unload(entry.add_update_listener(_options_updated))

    async def _first_sample(_hass: HomeAssistant) -> None:
        await _apply_retention(entry)
        await sampler.async_tick()
        if state.pop("rescan_needed", False):
            start_scan(hass)

    async_at_started(hass, _first_sample)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Cache-bust on the JS file's modification time, so reloading the integration
    # picks up a replaced bundle without restarting Home Assistant.
    js_file = Path(__file__).parent / "frontend" / "db-storage-panel.js"
    js_stamp = await hass.async_add_executor_job(lambda: int(js_file.stat().st_mtime))

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="db-storage-panel",
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{STATIC_URL}/db-storage-panel.js?v={VERSION}-{js_stamp}",
        sidebar_title="DB Storage",
        sidebar_icon="mdi:database-search",
        require_admin=True,
        config={},
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Removing the integration takes its automation with it."""
    await automation_sync.async_sync(hass, False, "00:00:00")
