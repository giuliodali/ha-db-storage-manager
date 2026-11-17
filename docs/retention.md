# Retention

Home Assistant keeps every entity's state history for one global number of days (`purge_keep_days`, 10 by default). DB Storage Manager adds **per-entity** limits: keep 1, 3, 5 or 7 days of detailed *states* for a noisy sensor, and the global default for everything else.

## What it limits (and what it doesn't)

- It limits detailed **state history** only. **Long-term statistics** (the hourly data behind history graphs and the Energy dashboard) are never touched, so a power sensor can keep two days of states and years of statistics.
- A rule can only **shorten** Home Assistant's limit, never lengthen it, because Home Assistant's own purge still runs.
- If an entity has no long-term statistics (not every domain does), the dialog warns you that older states will be lost with nothing to replace them.

## Setting a rule

Select entities → **Change retention** → pick **1d | 3d | 5d | 7d | default (Nd)**. The dialog remembers your choice. **Delete older states now** removes already-older rows immediately; those are backed up first and the whole action can be undone (undo also restores the previous rule). **default** removes the rule and deletes nothing. Rules show as a badge (`3d`) on the row and in the **Retention** filter.

## Housekeeping

A disabled entity records nothing, so disabling it from this panel removes its retention rule (Undo puts it back). The nightly run also drops rules for entities that no longer exist anywhere.

## How it runs

The integration schedules the nightly job itself, at the time set in the integration options (default 04:35, after Home Assistant's own purge). For each retention setting it calls the standard `recorder.purge_entities` with that rule's entities and `keep_days`, then `recorder.purge` with `repack: true` to return the freed space.

Change the time or turn it off in the integration options (see [Options](options-and-services.md)). To run it from your own automation instead (for example to get an automation trace, or add conditions), turn the nightly run off and call the `db_storage_manager.run_retention` action.

**Run retention now** is in the menu beside Re-Scan.

> Versions up to 1.0.5 kept the nightly job as an automation, **DB Storage: nightly retention**, in `automations.yaml`. It is no longer maintained; Settings → Repairs asks you to delete it if it is still there.

Rows deleted by the nightly run are not backed up: it is a rolling window by design.

## Seeing and tracking it

- **Overview tab**: the **Reduced retention** KPI shows how many entities have a rule and when the job last ran; hover for the exact time, rows deleted and schedule, click to list those entities.
- **History tab**: an entry whenever rows were deleted.
- **Sensors:** `Retention rules` and `Retention last run`.
- **Event** `db_storage_manager_retention_run` after every run, for notifications.
- The Home Assistant log (`custom_components.db_storage_manager.retention`).
