from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import DATABASE_URL

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

from sqlalchemy import text

def run_migrations():
    """Ensures newly added columns exist in tables without breaking existing SQLite / MySQL DB."""
    try:
        with engine.connect() as conn:
            if "sqlite" in DATABASE_URL:
                result = conn.execute(text("PRAGMA table_info(bookings)")).fetchall()
                col_names = [r[1] for r in result]
                if col_names: # table exists
                    if "payment_status" not in col_names:
                        conn.execute(text("ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'UNPAID'"))
                    if "payment_method" not in col_names:
                        conn.execute(text("ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(50)"))
                    if "transaction_ref" not in col_names:
                        conn.execute(text("ALTER TABLE bookings ADD COLUMN transaction_ref VARCHAR(64)"))
                    if "paid_at" not in col_names:
                        conn.execute(text("ALTER TABLE bookings ADD COLUMN paid_at DATETIME"))
                    conn.commit()

                result_wp = conn.execute(text("PRAGMA table_info(worker_profiles)")).fetchall()
                col_names_wp = [r[1] for r in result_wp]
                if col_names_wp:
                    if "aadhaar_number" not in col_names_wp:
                        conn.execute(text("ALTER TABLE worker_profiles ADD COLUMN aadhaar_number VARCHAR(20)"))
                    conn.commit()
    except Exception as e:
        print(f"Migration note: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

