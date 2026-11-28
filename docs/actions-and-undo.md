# Actions and undo

Select entities with the checkboxes (or **Select all N matching** to take everything that matches the current filters). The selection bar offers:

| Action | What it does |
|---|---|
| **Disable** | Disables the entity in the entity registry so it stops recording. Nothing is deleted. |
| **Clear history** | Deletes the entity's long-term and 5-minute statistics, and (ticked by default) its recorded state history. |
| **Disable + clear** | Both, in the safe order: disable first, so a live sensor can't immediately recreate what was just cleared. |
| **Change retention** | Keep only the last 1, 3, 5 or 7 days of detailed states, or go back to Home Assistant's default. See [Retention](retention.md). |

## Previews

Every action opens a preview first: per entity what will happen, how much it should free, and warnings (still active, referenced in your configuration). Batches over 25 entities ask you to type the count. One action runs at a time, up to 500 entities each, in the background with progress.

## Backups and undo

Before anything is deleted, everything an action clears is written to **one compressed backup file** per action, in `/config/db_storage_manager/snapshots/`: statistics, 5-minute statistics and (if ticked) state history with attributes. If the disk couldn't hold the backup, the action is refused up front. If a backup fails, that entity's history is kept.

**Undo** (History tab) restores the whole batch. Only missing rows are added (matched on time), so anything recorded since is kept. Entities that were disabled are turned back on, but only if they are still disabled by that action. The backup file is then removed. An action can be undone once.

## Health check after disabling

The Referenced In scan reads your configuration. It can't see what an integration's own code reads, and some integrations compute one entity from others (Solarman's battery sensors, for example), so an entity can look unused and still be needed.

So on each scan, the panel looks at the recorded state history of the other enabled entities from the same integration as anything you disabled in the last 14 days. An entity is flagged only if it was working when you disabled something, has had no working state since, is unavailable now, went down within a day of the action, and has been down for at least 3 hours. An entity that dropped out and came back is a blip and is ignored, and so is one that was already down before.

When something is flagged, the action in the History tab shows a warning with the names and when each went down, a notification appears in Home Assistant, and **Undo** brings the disabled entities back. **Check now** on the action repeats the check on demand once 3 hours have passed. It is a hint, not proof: an entity can drop out for unrelated reasons that happen to follow your action.

## The History tab

One line per entity. Columns: when, action, **Est. freed** (database space), **Backup** (file size on disk), status. Identical text across a group moves into an (i) tooltip.

- The **Undo data** card shows how much room backups use and where they live.
- Tick records and **Delete selected** to remove old records and their backup files; it shows the disk space recovered.
- Entries from nightly retention runs appear as "Retention rules (nightly)".
- An action cut short by a restart is marked **Interrupted**.

## Reclaim free space

Deleting rows leaves empty space inside the database file. **Reclaim free space** (the menu beside Re-Scan) asks the recorder to repack so the space goes back to the disk, waits for it, and reports the change in size. It refuses if under 1 MB would be reclaimed. The nightly retention job repacks as well.
