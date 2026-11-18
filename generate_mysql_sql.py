import sqlite3
from pathlib import Path

root_dir = Path(__file__).resolve().parent
db_path = root_dir / "backend" / "servicehub.db"
schema_path = root_dir / "schema.sql"
out_path = root_dir / "servicehub_mysql.sql"

sqlite_conn = sqlite3.connect(db_path)
s_cur = sqlite_conn.cursor()

with open(schema_path, "r", encoding="utf-8") as f:
    schema = f.read()

out_lines = [
    "-- =======================================================",
    "-- SERVICEHUB FULL MYSQL DATABASE SCRIPT WITH LIVE DATA",
    "-- Project: ServiceHub (BCA Sem-V, SEC205-3C, Group F10)",
    "-- =======================================================\n",
    "CREATE DATABASE IF NOT EXISTS `servicehub_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
    "USE `servicehub_db`;\n",
    "SET FOREIGN_KEY_CHECKS = 0;\n",
    schema,
    "\n-- =======================================================",
    "-- INSERT LIVE PRODUCTION RECORDS",
    "-- =======================================================\n"
]

tables = ["users", "service_categories", "worker_profiles", "bookings", "otp_verifications", "reviews"]

for table in tables:
    s_cur.execute(f"PRAGMA table_info({table})")
    cols = [f"`{c[1]}`" for c in s_cur.fetchall()]
    cols_str = ", ".join(cols)
    
    s_cur.execute(f"SELECT * FROM {table}")
    rows = s_cur.fetchall()
    
    if rows:
        out_lines.append(f"-- Records for table `{table}`")
        for r in rows:
            formatted_vals = []
            for v in r:
                if v is None:
                    formatted_vals.append("NULL")
                elif isinstance(v, (int, float)):
                    formatted_vals.append(str(v))
                else:
                    escaped = str(v).replace("'", "''")
                    formatted_vals.append(f"'{escaped}'")
            vals_str = ", ".join(formatted_vals)
            out_lines.append(f"INSERT INTO `{table}` ({cols_str}) VALUES ({vals_str});")
        out_lines.append("")

out_lines.append("SET FOREIGN_KEY_CHECKS = 1;\n")

with open(out_path, "w", encoding="utf-8") as out:
    out.write("\n".join(out_lines))

print(f"Generated {out_path} successfully!")
