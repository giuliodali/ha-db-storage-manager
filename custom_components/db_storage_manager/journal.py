"""The integration's own small SQLite file (never the recorder DB). No Home Assistant imports."""

from __future__ import annotations

import json
import sqlite3
import threading
from pathlib import Path
from typing import Any

SCHEMA_VERSION = 4


class Journal:
    """Size history and the action log (what was changed, so it can be undone)."""

    def __init__(self, path: Path) -> None:
        self._path = path
        self._lock = threading.Lock()

    def _connect(self) -> sqlite3.Connection:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(self._path, timeout=10)
        conn.row_factory = sqlite3.Row
        return conn

    def setup(self) -> None:
        with self._lock, self._connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
                CREATE TABLE IF NOT EXISTS size_history (
                    ts REAL PRIMARY KEY,
                    file_bytes INTEGER NOT NULL,
                    free_bytes INTEGER,
                    tables_json TEXT
                );
                CREATE TABLE IF NOT EXISTS actions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ts REAL NOT NULL,
                    kind TEXT NOT NULL,
                    summary TEXT,
                    status TEXT NOT NULL,
                    entities_json TEXT NOT NULL,
                    est_bytes INTEGER,
                    undone_ts REAL,
                    error TEXT
                );
                """
            )
            cols = {r["name"] for r in conn.execute("PRAGMA table_info(size_history)")}
            if "undo_bytes" not in cols:  # v3: space taken by undo backups at each sample
                conn.execute("ALTER TABLE size_history ADD COLUMN undo_bytes INTEGER")
            if "stats_bytes" not in cols:  # v4: space taken by long-term statistics tables
                conn.execute("ALTER TABLE size_history ADD COLUMN stats_bytes INTEGER")
            conn.execute(
                "INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)",
                (str(SCHEMA_VERSION),),
            )

    def add_size(self, ts: float, file_bytes: int, free_bytes: int | None,
                 tables_json: str | None = None, undo_bytes: int | None = None,
                 stats_bytes: int | None = None) -> None:
        with self._lock, self._connect() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO size_history (ts, file_bytes, free_bytes, tables_json, undo_bytes, stats_bytes) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (ts, file_bytes, free_bytes, tables_json, undo_bytes, stats_bytes),
            )

    def size_history(self, since: float = 0.0, limit: int = 5000) -> list[dict[str, Any]]:
        with self._lock, self._connect() as conn:
            rows = conn.execute(
                "SELECT ts, file_bytes, free_bytes, undo_bytes, stats_bytes FROM size_history WHERE ts >= ? "
                "ORDER BY ts DESC LIMIT ?",
                (since, limit),
            ).fetchall()
        return [dict(r) for r in reversed(rows)]

    def last_ts(self) -> float | None:
        with self._lock, self._connect() as conn:
            row = conn.execute("SELECT MAX(ts) AS t FROM size_history").fetchone()
        return row["t"] if row and row["t"] is not None else None

    def last_row(self) -> dict[str, Any] | None:
        with self._lock, self._connect() as conn:
            row = conn.execute(
                "SELECT ts, file_bytes, free_bytes, undo_bytes, stats_bytes FROM size_history ORDER BY ts DESC LIMIT 1"
            ).fetchone()
        return dict(row) if row else None

    def last_table_snapshot(self) -> str | None:
        with self._lock, self._connect() as conn:
            row = conn.execute(
                "SELECT tables_json FROM size_history WHERE tables_json IS NOT NULL "
                "ORDER BY ts DESC LIMIT 1"
            ).fetchone()
        return row["tables_json"] if row else None

    # --- action log ---------------------------------------------------------

    def add_action(self, ts: float, kind: str, summary: str, entities: list[dict[str, Any]],
                   est_bytes: int | None) -> int:
        with self._lock, self._connect() as conn:
            cur = conn.execute(
                "INSERT INTO actions (ts, kind, summary, status, entities_json, est_bytes) "
                "VALUES (?, ?, ?, 'running', ?, ?)",
                (ts, kind, summary, json.dumps(entities), est_bytes),
            )
            return int(cur.lastrowid)

    def update_action(self, action_id: int, **fields: Any) -> None:
        allowed = {"status", "entities", "undone_ts", "error", "summary", "est_bytes"}
        if not fields or set(fields) - allowed:
            raise ValueError(f"cannot update {sorted(set(fields) - allowed)}")
        cols, vals = [], []
        for key, value in fields.items():
            cols.append("entities_json = ?" if key == "entities" else f"{key} = ?")
            vals.append(json.dumps(value) if key == "entities" else value)
        with self._lock, self._connect() as conn:
            conn.execute(f"UPDATE actions SET {', '.join(cols)} WHERE id = ?", (*vals, action_id))

    @staticmethod
    def _action(row: sqlite3.Row) -> dict[str, Any]:
        d = dict(row)
        d["entities"] = json.loads(d.pop("entities_json"))
        return d

    def get_action(self, action_id: int) -> dict[str, Any] | None:
        with self._lock, self._connect() as conn:
            row = conn.execute("SELECT * FROM actions WHERE id = ?", (action_id,)).fetchone()
        return self._action(row) if row else None

    def list_actions(self, limit: int = 100) -> list[dict[str, Any]]:
        with self._lock, self._connect() as conn:
            rows = conn.execute("SELECT * FROM actions ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
        return [self._action(r) for r in rows]

    def mark_interrupted(self) -> int:
        """Actions still 'running' after a restart were cut short; flag them so they can be checked."""
        with self._lock, self._connect() as conn:
            cur = conn.execute(
                "UPDATE actions SET status = 'interrupted', error = 'Home Assistant restarted while this was running' "
                "WHERE status = 'running'"
            )
            return cur.rowcount

    def delete_actions(self, ids: list[int]) -> int:
        """Remove records (never one that is still running)."""
        if not ids:
            return 0
        marks = ",".join("?" * len(ids))
        with self._lock, self._connect() as conn:
            cur = conn.execute(f"DELETE FROM actions WHERE status != 'running' AND id IN ({marks})", ids)  # noqa: S608
            return cur.rowcount

    def file_bytes(self) -> int:
        return self._path.stat().st_size if self._path.exists() else 0
