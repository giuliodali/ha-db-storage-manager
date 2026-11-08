"""Database size sensors, updated only when a snapshot is taken (no polling)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, UnitOfInformation
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import retention
from .const import DOMAIN
from .sampler import SizeSampler

MIB = 1024 * 1024

DESCRIPTIONS = (
    SensorEntityDescription(
        key="file_bytes",
        translation_key="database_size",
        name="Database size",
        device_class=SensorDeviceClass.DATA_SIZE,
        native_unit_of_measurement=UnitOfInformation.MEGABYTES,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        entity_category=EntityCategory.DIAGNOSTIC,
        icon="mdi:database",
    ),
    SensorEntityDescription(
        key="free_bytes",
        translation_key="database_free_space",
        name="Database free space",
        device_class=SensorDeviceClass.DATA_SIZE,
        native_unit_of_measurement=UnitOfInformation.MEGABYTES,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        entity_category=EntityCategory.DIAGNOSTIC,
        icon="mdi:database-minus",
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback
) -> None:
    sampler: SizeSampler = hass.data[DOMAIN]["sampler"]
    async_add_entities([*(DbSizeSensor(entry, sampler, d) for d in DESCRIPTIONS), RetentionSensor(hass, entry, "rules"), RetentionSensor(hass, entry, "last_run")])


class RetentionSensor(SensorEntity):
    """How many retention rules exist, and when and what the nightly run last deleted."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, kind: str) -> None:
        self._hass, self._kind = hass, kind
        self._attr_unique_id = f"{entry.entry_id}_retention_{kind}"
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, entry.entry_id)}, name="DB Storage Manager")
        if kind == "rules":
            self._attr_name, self._attr_icon = "Retention rules", "mdi:calendar-clock"
            self._attr_native_unit_of_measurement = "entities"
        else:
            self._attr_name, self._attr_icon = "Retention last run", "mdi:history"
            self._attr_device_class = SensorDeviceClass.TIMESTAMP
        self._apply()

    def _apply(self) -> None:
        from datetime import datetime, timezone

        st = self._hass.data[DOMAIN]["retention"]
        if self._kind == "rules":
            self._attr_native_value = len(st["rules"])
            self._attr_extra_state_attributes = {"rules": dict(st["rules"])}
        else:
            last = st["last_run"]
            self._attr_native_value = datetime.fromtimestamp(last["ts"], timezone.utc) if last else None
            self._attr_extra_state_attributes = {"rows_deleted": last["rows"], "entities": last["entities"]} if last else {}

    async def async_added_to_hass(self) -> None:
        def _changed() -> None:
            self._apply()
            self.async_write_ha_state()

        self.async_on_remove(retention.add_listener(_changed))


class DbSizeSensor(SensorEntity):
    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry, sampler: SizeSampler, description: SensorEntityDescription) -> None:
        self.entity_description = description
        self._sampler = sampler
        self._attr_unique_id = f"{entry.entry_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)}, name="DB Storage Manager"
        )
        self._apply(sampler.last)

    def _apply(self, sample: dict[str, Any] | None) -> None:
        value = (sample or {}).get(self.entity_description.key)
        self._attr_native_value = None if value is None else round(value / MIB, 2)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._sampler.add_listener(self._on_sample))

    @callback
    def _on_sample(self, sample: dict[str, Any]) -> None:
        self._apply(sample)
        self.async_write_ha_state()
