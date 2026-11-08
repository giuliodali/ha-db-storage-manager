"""The nightly retention job as a normal Home Assistant automation, kept in step by this integration.

The automation lives in automations.yaml (so it shows in Settings > Automations like any other),
is titled and described as managed by DB Storage, and sits in the automation category "DB Storage".
Its only action is the `db_storage_manager.run_retention` service. The run time and the on/off
switch come from the integration's options; changing them rewrites just this one automation.

If the automation cannot be created (no automations.yaml, an unusual YAML layout, the automation
integration is not loaded) the integration falls back to scheduling the job itself.
"""

from __future__ import annotations

import logging
import os
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import category_registry as cr, entity_registry as er
from homeassistant.util.yaml import dump, load_yaml

from . import retention
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)
AUTOMATION_ID = "db_storage_retention"
CATEGORY_NAME = "DB Storage"
ALIAS = "DB Storage: nightly retention"
DESCRIPTION = (
    "Configured and maintained by the DB Storage integration. One standard recorder purge step per retention "
    "setting chosen in the DB Storage panel, then a repack to return the freed space; long-term statistics are not touched. The steps are rewritten "
    "whenever a rule changes. Change the time or turn it off in the integration's options. Edits made here are overwritten."
)


def _days(n: int) -> str:
    return f"{n} day" + ("" if n == 1 else "s")


def desired(hhmm: str, plan: list[tuple[int, list[str]]]) -> dict[str, Any]:
    """The automation: count what is due, one standard recorder purge per retention setting, repack the database, then record the run."""
    at = hhmm if hhmm.count(":") == 2 else f"{hhmm[:5]}:00"
    actions: list[dict[str, Any]] = [{"alias": "Count the states about to be deleted", "action": f"{DOMAIN}.run_retention", "data": {"mode": "count"}}]
    for days, ids in plan:
        actions.append({"alias": f"Keep {_days(days)} of states for {len(ids)} entit{'y' if len(ids) == 1 else 'ies'}",
                        "action": "recorder.purge_entities", "data": {"entity_id": ids, "keep_days": days}})
    actions.append({"alias": "Repack the database to return the freed space", "action": "recorder.purge",
                    "data": {"repack": True}})
    actions.append({"alias": "Record the run (History tab, sensors, event)", "action": f"{DOMAIN}.run_retention", "data": {"mode": "record"}})
    return {
        "id": AUTOMATION_ID,
        "alias": ALIAS,
        "description": DESCRIPTION,
        "mode": "single",
        "triggers": [{"trigger": "time", "at": at}],
        "conditions": [],
        "actions": actions,
    }


def _edit_file(path: str, enabled: bool, item: dict[str, Any]) -> bool:
    """Blocking. Add, replace or remove our entry; True when the file changed."""
    items: list[Any] = []
    if os.path.exists(path):
        loaded = load_yaml(path)
        if loaded is None:
            loaded = []
        if not isinstance(loaded, list):
            raise ValueError("automations.yaml is not a list")
        items = loaded
    idx = next((i for i, x in enumerate(items) if isinstance(x, dict) and str(x.get("id")) == AUTOMATION_ID), None)
    if not enabled:
        if idx is None:
            return False
        del items[idx]
    elif idx is None:
        items.append(item)
    elif items[idx] == item:
        return False
    else:
        items[idx] = item
    tmp = f"{path}.dbs_tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        fh.write(dump(items))
    os.replace(tmp, path)
    return True


def entity_id(hass: HomeAssistant) -> str | None:
    return er.async_get(hass).async_get_entity_id("automation", "automation", AUTOMATION_ID)


def _ensure_category(hass: HomeAssistant, eid: str) -> None:
    cats = cr.async_get(hass)
    cat = next((c for c in cats.async_list_categories(scope="automation") if c.name == CATEGORY_NAME), None)
    if cat is None:
        cat = cats.async_create(name=CATEGORY_NAME, icon="mdi:database-search", scope="automation")
    reg = er.async_get(hass)
    entry = reg.async_get(eid)
    if entry and (entry.categories or {}).get("automation") != cat.category_id:
        reg.async_update_entity(eid, categories={**(entry.categories or {}), "automation": cat.category_id})


async def async_sync(hass: HomeAssistant, enabled: bool, hhmm: str) -> str:
    """Make the automation match the options. Returns "automation", "off" or "unavailable"."""
    path = hass.config.path("automations.yaml")
    if not hass.services.has_service("automation", "reload"):
        return "unavailable"
    try:
        changed = await hass.async_add_executor_job(_edit_file, path, enabled, desired(hhmm, retention.plan(hass)))
    except Exception as err:  # noqa: BLE001 - odd YAML, read-only config folder, ...
        _LOGGER.warning("Could not maintain the DB Storage automation (%s); the integration runs retention itself", err)
        return "unavailable"
    if changed:
        await hass.services.async_call("automation", "reload", blocking=True)
    eid = entity_id(hass)
    if not enabled:
        if eid:  # the automation is gone from the file; drop its leftover registry entry too
            er.async_get(hass).async_remove(eid)
        return "off"
    if eid is None:
        _LOGGER.warning("The DB Storage automation was written but did not load; the integration runs retention itself")
        return "unavailable"
    _ensure_category(hass, eid)
    return "automation"


def info(hass: HomeAssistant) -> dict[str, Any] | None:
    eid = entity_id(hass)
    if eid is None:
        return None
    st = hass.states.get(eid)
    if st is None or st.attributes.get("restored"):
        return None
    return {"entity_id": eid, "link": f"/config/automation/edit/{AUTOMATION_ID}", "on": bool(st and st.state == "on"),
            "name": ALIAS}


async def async_run_now(hass: HomeAssistant) -> dict[str, Any]:
    """Run the maintained automation (so its run shows in its own trace); the service directly if it cannot."""
    eid = entity_id(hass)
    st = hass.states.get(eid) if eid else None
    if eid and st is not None and st.state == "on":
        await hass.services.async_call("automation", "trigger", {"entity_id": eid, "skip_condition": True}, blocking=True)
        return {"via": "automation", "entity_id": eid, "last_run": retention.status(hass)["last_run"]}
    return {"via": "direct", "entity_id": eid, "last_run": await retention.async_run(hass)}
