# Troubleshooting and FAQ

**The sidebar item isn't there.** It's admin-only. Check the integration is added (Settings → Devices & services) and refresh the browser. After an update that changed the panel, reload the integration and hard-refresh the page.

**An update didn't show.** Frontend-only changes: reload the integration and refresh the browser. Any Python change needs a Home Assistant restart.

**I cleared an entity and it came back.** A live sensor writes a new row at the next 5-minute mark. Use **Disable + clear** so it is disabled first.

**Database size doesn't match what my tool shows.** On SQLite, Home Assistant runs in WAL mode. DB Storage reports pages × page size (what SQLite Web reports); hover the tile for the main file, the write-ahead log and the exact bytes. 1 MB here is 1,048,576 bytes.

**I deleted a lot but the file didn't shrink.** Deleted rows leave empty space inside the file. Use **Reclaim free space**; the nightly retention job also repacks.

**An entity shows "0 🔗" but I use it.** The scan finds literal ids only. Check dynamic templates, areas, labels and anything outside Home Assistant; look for "+N dynamic".

**Where is the retention automation?** Settings → Automations, category **DB Storage**, "DB Storage: nightly retention". Click **Open the automation** in the History tab or the menu beside Re-Scan.

**Can I edit that automation?** It's rewritten whenever a rule or the options change. Change the time or switch it off in the integration options.

**Can I use MariaDB or PostgreSQL?** Yes. See [Databases](databases.md) for how sizes are measured on each and what is approximate.

**How do I get rid of the undo backups?** History tab → tick records → **Delete selected**. That also removes their files and shows the space recovered.

**How do I report a problem?** Open an issue with your Home Assistant and integration versions and the log lines from `custom_components.db_storage_manager`.

**automations.yaml has garbage after the DB Storage automation (version 1.0.4 and earlier).** Overlapping rewrites could corrupt it. Open the file, delete everything from `- id: db_storage_retention` to the end of that automation block, and remove any stray lines after it (leftover fragments such as `etention` or a repeated `data:` / `mode: record`). Check Settings → Developer tools → YAML → Check configuration, then restart. From 1.0.6 the integration no longer writes to `automations.yaml` at all; 1.0.5 left a copy of the file as `automations.yaml.dbs_backup`, which you can delete.

**How do I capture debug logs?** Add this to `configuration.yaml` and restart (or call **Developer tools > Actions > `logger.set_level`** with `custom_components.db_storage_manager: debug`):

```yaml
logger:
  default: warning
  logs:
    custom_components.db_storage_manager: debug
    homeassistant.components.recorder: info
```

Reproduce the problem, then take the lines from **Settings > System > Logs** (filter on `db_storage_manager`) or **Download full log**. When reporting, include the Home Assistant version, your database type and version, and the recorder `db_url` without the password. Remove anything private.
