# Changelog

## Unreleased

- PostgreSQL and MariaDB/MySQL recorders are supported, detected automatically. Table sizes, the database size and its history come from each database's own size functions (exact on PostgreSQL, the storage engine's statistics on MariaDB/MySQL), the per-entity sizes still add up to the table sizes, and the free-space figure is left out where the database can't give one (PostgreSQL). The retention predictions round ages down on every database. Details in docs/databases.md.

## 1.0.8

- The Settings tab no longer edits your YAML. The default state retention slider still predicts the space a value frees or adds; for a new value it shows the `recorder: purge_keep_days` lines to put in your configuration yourself, with a Copy button, a link to the recorder documentation and a restart button. A `.dbs_backup` copy left by 1.0.7 can be deleted.

## 1.0.7

- New **Settings** tab, showing what is configured now:
  - **Default state retention** as a slider, with the space it would free or add. Saving writes `purge_keep_days` under `recorder:` in your YAML (validated, previous file kept as `.dbs_backup`) and applies after a restart.
  - **Long-term statistics retention**, kept forever by default, in 6-month steps from 6 months to 7 years, with a separate setting for Energy dashboard statistics. Each step shows what it frees and keeps. Limits are applied once a month by the nightly retention run and are not backed up.
  - **Hide automations** moved here from the Entities tab, on by default. The Overview figures always follow it, and clicking a KPI no longer changes it.
- **Referenced In: Energy dashboard** now also counts imported statistics the Energy dashboard uses and the cost sensors it creates, so it matches the Energy statistics on the Settings page. The saved scan is redone once after updating.
- The Database size KPI shows the free space inside the database as a line underneath ("~ 120 MB Free"), replacing the separate Free inside database KPI.
- New **Reduced retention** KPI on the Overview: how many entities keep less state history than the default, and when retention last ran. Hover for the details, click to list those entities. It replaces the Retention rules card on the History tab.
- Clicking an Overview KPI, chart or list now shows the same entities it counted. Drill-downs used to keep automations hidden, so the Entities grid could show fewer entities and less data than the KPI.

## 1.0.6

- The nightly retention job is scheduled by the integration itself. It no longer writes an automation to `automations.yaml` or touches the automation's registry entry. If you used 1.0.5 or earlier, Settings → Repairs asks you to delete the old **DB Storage: nightly retention** automation. To run retention from your own automation, turn the nightly run off and call `db_storage_manager.run_retention`.
- File checks (free disk space, backup files, the database file during size sampling) no longer run on Home Assistant's event loop, so slow storage can't stall it.
- The Energy dashboard's configuration is read through the energy integration's own API, not its storage file.
- Installation is now a search in HACS.

## 1.0.5

- Fixed automations.yaml being corrupted after a bulk action. Rewrites of the retention automation could overlap and share one temporary file. They now go through one at a time, wait for a bulk action to settle, use a private temp file, check the result parses first, and keep a copy of the previous file as `automations.yaml.dbs_backup`.

## 1.0.4

- After an action, just the entities it changed are re-read inside the action's own progress card, so no separate scan appears. Re-Scan stays a full scan that also picks up new entities.
- Clearing or trimming state history waits until the recorder has deleted every row. Large entities were left partly cleared (still showing a size) because the recorder re-queues big purges behind the point Home Assistant waits for.
- Reclaim free space says up front how many old states the repack will also delete (past the recorder's keep-days limit), and no longer shows an unchanged size while it runs. The size and free-space KPIs follow the live reading.
- A release that changes what a scan records now redoes the saved scan automatically on start, so no manual Re-Scan is needed after updating.
- Shorter confirmation dialogs.

## 1.0.3

- After an action the grid updates at once: status and retention are live, cleared sizes drop to zero, and changed sizes show ⟳ until Re-Scan.
- The nightly retention automation no longer counts as a reference.

## 1.0.2

Everything since 1.0.0:

- Size bars are readable on light themes.
- Selecting entities: the bar shows how many ticked entities are no longer in the list, with a button to drop them.
- The progress bar counts entities per phase (it showed twice the number of entities).
- Reclaim explains why it can free more than the empty space it reports.
- The size chart counts free space with the undo data.
- Disabling an entity now removes its retention rule (Undo puts it back), and the nightly run drops rules for entities that no longer exist.

## 1.0.0

First public release. Everything below was developed and refined with real-world feedback before this release.

- Project renamed to `ha-db-storage-manager`; front page, documentation, HACS metadata, GitHub checks and release workflow.

## 0.5.x

- Retention is a real automation, **DB Storage: nightly retention**, kept up to date by the integration, in the automation category **DB Storage**. It shows a count step, one standard `recorder.purge_entities` step per retention setting, a repack, then a record step. Run time and on/off are in the integration options; a `db_storage_manager.run_retention` action is available.
- **Run retention now** moved to the menu beside Re-Scan and triggers that automation, with a link to it.
- **Change retention** (1d, 3d, 5d, 7d, default) replaces Reduce and Default retention; dialog choices are remembered; a Retention facet filters by rule.
- Size chart: undo data, long-term statistics and everything else stacked; dates only on the axis; drag-to-drill clears its selection; help tip.
- Entities grid: split size bars (theme colours), wider name column, compact `N 🔗` references, row hover, **Referenced In** facet, **Defined in** separates Helper and YAML.
- YAML-defined entities (`sql`, `command_line`, `template`, ...) are matched by name or unique ID in YAML files.
- Inspector shows attribute JSON as collapsible objects instead of truncated text. Diagnostics tab removed.

## 0.4.x

- Per-entity **state retention**, enforced nightly; first clean-up is backed up and undoable.
- Size chart shows undo data; inspector JSON viewer; split states and statistics size bars.

## 0.3.x

- **Full batch backups**: one compressed file per action, including statistics and state history with attributes; undo restores the whole batch.
- Live suggestions (unavailable, no longer provided, YAML-defined, imported statistics), **Defined in** filter, reference counting of every place, "N more" facet expansion, wider inspector with list and detail, consistent **Re-Scan** wording.

## 0.2.x

- **Actions** (Disable, Clear history, Disable and clear) with previews, **History** tab and **Undo**, background jobs with progress.
- Inspector for stored states and statistics; History clean-up; opt-in Re-Scan after actions.

## 0.1.x

- **Suggestions** with confidence and reasons; **find what caused a spike** by dragging the size chart; select all matching; friendly names and icons.
- Accurate database size (pages x page size, WAL aware); **Reclaim free space** (repack).

## 0.0.x

- Data layer (dbstat sizing, size history journal, sensors), usage scan, the Lit and ECharts panel (Overview and Entities), background scans with progress, snapshot frequency option.
