"""DB Storage Manager: M0 spike. Registers a sidebar panel and admin WebSocket commands."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers import entity_registry as er, issue_registry as ir
from homeassistant.helpers.event import async_track_time_change, async_track_time_interval
from homeassistant.helpers.start import async_at_started

from .const import (CONF_RETENTION_ENABLED, CONF_RETENTION_TIME, CONF_SAMPLE_INTERVAL, DEFAULT_RETENTION_TIME, DEFAULT_SAMPLE_INTERVAL,
                    DOMAIN, LEGACY_RETENTION_AUTOMATION_ID, PANEL_URL_PATH, SAMPLE_INTERVALS, STATIC_URL, VERSION)
from .journal import Journal
from .sampler import SizeSampler
from . import retention, settings
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
    await settings.async_load(hass)

    async def _nightly(_now: datetime) -> None:
        await retention.async_run(hass)

    @callback
    def _apply_retention(e: ConfigEntry) -> None:
        """Schedule the nightly job from the options."""
        if (unsub := state.pop("retention_unsub", None)):
            unsub()
        retention.configure(hass, e.options.get(CONF_RETENTION_ENABLED, True), e.options.get(CONF_RETENTION_TIME, DEFAULT_RETENTION_TIME))
        cfg = state["retention_cfg"]
        if cfg["enabled"]:
            state["retention_unsub"] = async_track_time_change(hass, _nightly, hour=cfg["hour"], minute=cfg["minute"], second=0)
        retention._notify()

    _apply_retention(entry)
    entry.async_on_unload(lambda: state.pop("retention_unsub", lambda: None)())

    async def _run_retention_service(call: ServiceCall) -> None:
        # "count" and "record" were the first and last steps of the automation versions up to 1.0.5 wrote;
        # they still work so such a leftover automation does not run the whole job twice.
        mode = call.data.get("mode", "all")
        if mode == "count":
            await retention.async_count(hass)
        elif mode == "record":
            await retention.async_record(hass)
        else:
            await retention.async_run(hass)

    hass.services.async_register(DOMAIN, "run_retention", _run_retention_service)
    entry.async_on_unload(lambda: hass.services.async_remove(DOMAIN, "run_retention"))

    entry.async_on_unload(async_track_time_interval(hass, sampler.async_tick, timedelta(hours=1)))

    async def _options_updated(_hass: HomeAssistant, updated: ConfigEntry) -> None:
        sampler.interval_s = _interval_s(updated)
        _apply_retention(updated)

    entry.async_on_unload(entry.add_update_listener(_options_updated))

    async def _first_sample(_hass: HomeAssistant) -> None:
        _check_legacy_automation(hass)
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


@callback
def _check_legacy_automation(hass: HomeAssistant) -> None:
    """Versions up to 1.0.5 kept the nightly job as an automation in automations.yaml. The integration now
    schedules the job itself and no longer touches that file, so ask the user to delete the old automation."""
    eid = er.async_get(hass).async_get_entity_id("automation", "automation", LEGACY_RETENTION_AUTOMATION_ID)
    if eid is None:
        ir.async_delete_issue(hass, DOMAIN, "legacy_retention_automation")
        return
    ir.async_create_issue(
        hass, DOMAIN, "legacy_retention_automation", is_fixable=False, severity=ir.IssueSeverity.WARNING,
        translation_key="legacy_retention_automation",
        translation_placeholders={"entity_id": eid, "link": f"/config/automation/edit/{LEGACY_RETENTION_AUTOMATION_ID}"},
    )
