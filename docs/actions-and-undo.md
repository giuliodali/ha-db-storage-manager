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

## The History tab

One line per entity. Columns: when, action, **Est. freed** (database space), **Backup** (file size on disk), status. Identical text across a group moves into an (i) tooltip.

- The **Undo data** card shows how much room backups use and where they live.
- Tick records and **Delete selected** to remove old records and their backup files; it shows the disk space recovered.
- Entries from nightly retention runs appear as "Retention rules (nightly)".
- An action cut short by a restart is marked **Interrupted**.

## Reclaim free space

Deleting rows leaves empty space inside the database file. **Reclaim free space** (the menu beside Re-Scan) asks the recorder to repack so the space goes back to the disk, waits for it, and reports the change in size. It refuses if under 1 MB would be reclaimed. The nightly retention automation repacks as well.
