#!/usr/bin/env python3
"""One-off: fill DB Storage's "Database size over time" chart with 60 days of demo data.

The story: the database slowly shrinks as things are removed, undo backups grow, then the
undo backups are cleared. It ends exactly at your latest real sample, which is the target.

    python3 demo_size_history.py                   # back up the journal, then write the demo
    python3 demo_size_history.py --restore         # put your real history back
    python3 demo_size_history.py --journal PATH    # default /config/db_storage_manager/journal.db

Your real history is copied to journal.db.real first. Restart Home Assistant (or reload the
integration) afterwards so the panel and sampler pick the new rows up. Standard library only.
"""

import argparse
import math
import random
import shutil
import sqlite3
import sys
import time
from pathlib import Path

MB = 1024 * 1024
DAYS, STEP_H = 60, 6


def demo(end_total: int, end_stats: int, end_undo: int, end_ts: float) -> list[tuple]:
    rng = random.Random(7)
    n = DAYS * 24 // STEP_H
    start_ts = end_ts - DAYS * 86400
    clear_at = 0.72                                   # the undo backups are cleared here (fraction of the period)
    peak_undo = max(end_undo * 4, 140 * MB)
    shrink = 0.22 * end_total                         # how much the rest of the database shrinks over the 60 days
    stats0 = end_stats * 0.86                         # long-term statistics only creep up
    rows = []
    for i in range(n + 1):
        f = i / n
        ts = start_ts + f * DAYS * 86400
        stats = stats0 + (end_stats - stats0) * f + rng.uniform(-0.15, 0.15) * MB
        # everything else: starts bigger, shrinks in steps as entities are removed, ends on the target
        else_end = end_total - end_stats
        steps = 0.5 * f + 0.5 * (1 / (1 + math.exp(-14 * (f - 0.45))))
        rest = else_end + shrink * (1 - steps) + rng.uniform(-0.4, 0.4) * MB
        if f < clear_at:
            undo = peak_undo * (f / clear_at) ** 1.4 + rng.uniform(0, 0.8) * MB
        else:
            g = (f - clear_at) / (1 - clear_at)       # after the clear it starts again, small, ending on the real value
            undo = end_undo * g + rng.uniform(0, 0.3) * MB
        rows.append((ts, int(rest + stats), int(rng.uniform(0.6, 2.4) * MB), None, int(undo), int(stats)))
    ts, _, free, tj, undo, stats = rows[-1]
    rows[-1] = (end_ts, end_total, free, tj, end_undo, end_stats)   # exactly the latest real sample
    return rows


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--journal", default="/config/db_storage_manager/journal.db")
    ap.add_argument("--restore", action="store_true")
    ap.add_argument("--stats-mb", type=float, default=None, help="long-term statistics size if the latest sample has none (default 18%% of the database)")
    args = ap.parse_args()
    path = Path(args.journal)
    backup = path.with_name(path.name + ".real")
    if args.restore:
        if not backup.exists():
            print("No backup found:", backup)
            return 1
        shutil.copy2(backup, path)
        print("Restored", path, "from", backup)
        return 0
    if not path.exists():
        print("Journal not found:", path)
        return 1
    if not backup.exists():
        shutil.copy2(path, backup)
        print("Backed up your real history to", backup)
    conn = sqlite3.connect(path)
    cols = {r[1] for r in conn.execute("PRAGMA table_info(size_history)")}
    if not {"undo_bytes", "stats_bytes"} <= cols:
        print("Open the DB Storage panel once on version 0.4.2 or later so the journal is upgraded, then run this again.")
        return 1
    last = conn.execute("SELECT ts, file_bytes, undo_bytes, stats_bytes FROM size_history ORDER BY ts DESC LIMIT 1").fetchone()
    if not last:
        print("No real samples yet to use as the target.")
        return 1
    ts, total, undo, stats = last
    stats = stats or int((args.stats_mb * MB) if args.stats_mb else total * 0.18)
    rows = demo(total, stats, undo or 0, ts)
    with conn:
        conn.execute("DELETE FROM size_history")
        conn.executemany("INSERT INTO size_history (ts, file_bytes, free_bytes, tables_json, undo_bytes, stats_bytes) VALUES (?,?,?,?,?,?)", rows)
    conn.close()
    print(f"Wrote {len(rows)} demo samples over {DAYS} days, ending at {total / MB:.1f} MB (statistics {stats / MB:.1f} MB, undo {(undo or 0) / MB:.1f} MB).")
    print("Restart Home Assistant, then reload the panel. To undo this: python3 demo_size_history.py --restore")
    return 0


if __name__ == "__main__":
    sys.exit(main())
