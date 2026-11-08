# Options, sensors and services

## Options

Settings → Devices & services → DB Storage Manager → **Configure**.

| Option | Meaning |
|---|---|
| **Snapshot frequency** | How often a point is added to the size history: hourly, 6 hours, daily (default), weekly. The two size sensors update at the same time. "Sample now", Re-Scan, actions and undo always add a point. |
| **Nightly retention** | On or off. Off removes the maintained automation. |
| **Retention time** | When it runs. Default 04:35, after Home Assistant's own purge at 04:12. |

Changes apply immediately.

## Sensors

| Sensor | State |
|---|---|
| Database size, Database free space | MB, updated at the snapshot frequency |
| Retention rules | Number of rules, with the rules as attributes |
| Retention last run | Timestamp, with `rows_deleted` and `entities` |

## Event

`db_storage_manager_retention_run` after every retention run, with `rows`, `entities`, `rules`, `default_days`. Use it as an automation trigger, for example to notify you.

## Action (service)

`db_storage_manager.run_retention` applies every rule now.

| `mode` | Use |
|---|---|
| `all` (default) | The whole job in one call, then a repack |
| `count`, `record` | The first and last steps of the maintained automation |

## Files it keeps

| Path | Content |
|---|---|
| `/config/db_storage_manager/journal.db` | Size history and the action log (its own small file, never the recorder database) |
| `/config/db_storage_manager/inventory.json.gz` | The last scan |
| `/config/db_storage_manager/snapshots/` | Undo backups |
| `/config/.storage/db_storage_manager.retention` | Retention rules |
| `/config/automations.yaml` | The one maintained automation (when retention is on) |
