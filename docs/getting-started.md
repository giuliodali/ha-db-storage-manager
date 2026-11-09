# Getting started

## Requirements

- Home Assistant 2026.11 or newer.
- The recorder on **SQLite** (the default). The size analysis uses SQLite's `dbstat`, so MariaDB and PostgreSQL aren't supported.
- An administrator account. The **DB Storage** sidebar item is hidden from other users.

## Install

1. Back up Home Assistant (Settings → System → Backups).
2. In HACS: ⋮ → **Custom repositories** → `https://github.com/giuliodali/ha-db-storage-manager` → category **Integration** → **Download**. (HACS is the supported way to install and update.)
3. Restart Home Assistant.
4. Settings → Devices & services → **Add integration** → DB Storage Manager. There is nothing to fill in.
5. Open **DB Storage** in the sidebar.

## First scan

The first time, the panel scans the whole database: it runs in the background with a progress card and takes a few seconds on a few hundred MB. The result is saved, so the panel opens instantly after a restart.

After an action the grid updates at once: disabled entities show as Disabled, the retention shown is the new one, and cleared sizes drop to zero. The same progress card then re-reads just the entities the action changed ("Refreshing sizes"), so their sizes are right when it finishes and you never see a separate scan. If that refresh fails, the sizes show **⟳** until you press **Re-Scan** (top right), which always re-reads everything and picks up new entities.

The arrow beside Re-Scan opens a menu: **Re-Scan**, **Run retention now**, **Reclaim free space**.

## The three tabs

| Tab | Use it to |
|---|---|
| **Overview** | See the database size, how much is unreferenced or a cleanup candidate, a treemap by integration and type, the largest entities, and size over time. Click a tile, a treemap box or an entity to jump to Entities with that filter. |
| **Entities** | Search and filter every entity, pick some, and act on them. See [Finding things](entities.md) and [Actions and undo](actions-and-undo.md). |
| **History** | See every action taken, undo them, delete old records and their backups, and see retention rules. |

The page title shows active filters as chips. Click one to remove it, or **Clear all**.

## Size over time

The chart stacks three series, bottom to top: **free space / undo data** (empty space inside the database file, plus the backups kept beside it), **long-term statistics**, and **everything else**. The top edge is the database size plus the undo backups. Drag across a period to see which entities wrote data then. Samples are taken on the schedule in the integration options (daily by default) and also after every Re-Scan, action and undo.
