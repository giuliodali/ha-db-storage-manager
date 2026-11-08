# Changelog

## 1.0.1

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
