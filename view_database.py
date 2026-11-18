import sqlite3
import sys
from pathlib import Path

# Enable UTF-8 encoding on Windows console
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

db_path = Path(__file__).resolve().parent / "backend" / "servicehub.db"

def show_database():
    if not db_path.exists():
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    tables = [row[0] for row in cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").fetchall()]

    print("=" * 80)
    print("  SERVICEHUB SQL DATABASE VIEWER")
    print(f"  File Location: {db_path}")
    print("=" * 80)

    for table in tables:
        cur.execute(f"PRAGMA table_info({table})")
        columns = [c[1] for c in cur.fetchall()]
        
        cur.execute(f"SELECT * FROM {table}")
        rows = cur.fetchall()

        print(f"\nTABLE: [{table.upper()}] — ({len(rows)} records)")
        print("-" * 80)
        print(" | ".join(columns[:6]) + ("..." if len(columns) > 6 else ""))
        print("-" * 80)
        for r in rows[:5]:
            vals = [str(x)[:20] if x is not None else "NULL" for x in r[:6]]
            print(" | ".join(vals))
        if len(rows) > 5:
            print(f" ... and {len(rows) - 5} more rows.")
        print("-" * 80)

    conn.close()

if __name__ == "__main__":
    show_database()
