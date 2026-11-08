# Retention

Home Assistant keeps every entity's state history for one global number of days (`purge_keep_days`, 10 by default). DB Storage Manager adds **per-entity** limits: keep 1, 3, 5 or 7 days of detailed *states* for a noisy sensor, and the global default for everything else.

## What it limits (and what it doesn't)

- It limits detailed **state history** only. **Long-term statistics** (the hourly data behind history graphs and the Energy dashboard) are never touched, so a power sensor can keep two days of states and years of statistics.
- A rule can only **shorten** Home Assistant's limit, never lengthen it, because Home Assistant's own purge still runs.
- If an entity has no long-term statistics (not every domain does), the dialog warns you that older states will be lost with nothing to replace them.

## Setting a rule

Select entities → **Change retention** → pick **1d | 3d | 5d | 7d | default (Nd)**. The dialog remembers your choice. **Delete older states now** removes already-older rows immediately; those are backed up first and the whole action can be undone (undo also restores the previous rule). **default** removes the rule and deletes nothing. Rules show as a badge (`3d`) on the row and in the **Retention** filter.

## How it runs: a normal automation

The nightly job is an ordinary Home Assistant automation, written and kept up to date by the integration:

> **DB Storage: nightly retention** (Settings → Automations, category **DB Storage**)

| Step | What it is |
|---|---|
| Count the states about to be deleted | `db_storage_manager.run_retention` with `mode: count` |
| *Keep 1 day of states for N entities* | a standard `recorder.purge_entities` with that rule's entities and `keep_days` (one step per retention setting) |
| Repack the database to return the freed space | `recorder.purge` with `repack: true` |
| Record the run | `db_storage_manager.run_retention` with `mode: record` (History tab, sensors, event) |

Change a rule and the steps are rewritten. It's described as maintained by this integration, so **edits you make to it are overwritten**; change the time or turn it off in the integration options instead (see [Options](options-and-services.md)). Turning it off, or removing the integration, removes the automation. Your other automations are untouched. If the automation can't be created (no `automations.yaml`, an unusual layout), the integration schedules the job itself.

**Run retention now** is in the menu beside Re-Scan. It triggers the automation (so the run shows in its trace), and the menu links to it.

Rows deleted by the nightly run are not backed up: it is a rolling window by design.

## Seeing and tracking it

- **Automation trace** for each run.
- **History tab**: the Retention rules card (rules, last run, rows deleted, link to the automation) and an entry whenever rows were deleted.
- **Sensors:** `Retention rules` and `Retention last run`.
- **Event** `db_storage_manager_retention_run` after every run, for notifications.
- The Home Assistant log (`custom_components.db_storage_manager.retention`).
