# Databases

DB Storage works with whichever database the recorder uses. It is detected automatically; there is nothing to pick or configure.

| | SQLite | PostgreSQL | MariaDB / MySQL |
|---|---|---|---|
| Size per table | exact (`dbstat`) | exact (`pg_total_relation_size`, indexes and large values included) | engine statistics, approximate |
| Database size | pages × page size | `pg_database_size`, the whole database | tables + indexes + free space |
| Free space inside the database | exact | not shown | from `data_free`, approximate |
| Reclaim free space | `VACUUM` | the recorder's repack | the recorder's repack |

## What differs

- **PostgreSQL has no cheap exact figure for reusable space**, so the free-space line and sensor stay empty. Reclaim still works; the panel follows the database size to see when it finishes.
- **MariaDB and MySQL report sizes from the storage engine's statistics.** They can lag behind the data a little, so figures are approximate. Per-entity sizes are still scaled to add up to the table sizes the database reports.
- **The database size on PostgreSQL covers everything in that database**, not only the recorder's tables, so it can be larger than the sum of the tables.
- The write-ahead-log split in the size tooltip exists only on SQLite.
- Reclaiming rewrites tables. On PostgreSQL and MariaDB/MySQL that locks them while it runs and needs free disk space roughly equal to the table sizes, so do it when little else is going on.

The long-term statistics, history, retention rules and undo backups behave the same on every database. Undo backups are files in your configuration folder, never in the database.
