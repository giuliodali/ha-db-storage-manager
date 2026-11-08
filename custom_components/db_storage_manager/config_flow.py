"""Config flow: single instance; one option for how often history is snapshotted."""

from __future__ import annotations

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.selector import BooleanSelector, SelectSelector, SelectSelectorConfig, SelectSelectorMode, TimeSelector

from .const import (CONF_RETENTION_ENABLED, CONF_RETENTION_TIME, CONF_SAMPLE_INTERVAL, DEFAULT_RETENTION_TIME,
                    DEFAULT_SAMPLE_INTERVAL, DOMAIN, SAMPLE_INTERVAL_LABELS)


class DbStorageManagerConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the one-click setup."""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> ConfigFlowResult:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title="DB Storage Manager", data={})
        return self.async_show_form(step_id="user")

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return DbStorageManagerOptionsFlow()


class DbStorageManagerOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input=None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        current = self.config_entry.options.get(CONF_SAMPLE_INTERVAL, DEFAULT_SAMPLE_INTERVAL)
        options = [{"value": k, "label": v} for k, v in SAMPLE_INTERVAL_LABELS.items()]
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_SAMPLE_INTERVAL, default=current): SelectSelector(
                        SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN)
                    ),
                    vol.Required(CONF_RETENTION_ENABLED, default=self.config_entry.options.get(CONF_RETENTION_ENABLED, True)): BooleanSelector(),
                    vol.Required(CONF_RETENTION_TIME, default=self.config_entry.options.get(CONF_RETENTION_TIME, DEFAULT_RETENTION_TIME)): TimeSelector(),
                }
            ),
        )
