import os
import sys
import uvicorn
from pathlib import Path

# Ensure UTF-8 output encoding for Windows command prompts
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

root_dir = Path(__file__).resolve().parent
backend_dir = root_dir / "backend"

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(root_dir) not in sys.path:
    sys.path.insert(1, str(root_dir))

from backend.app.database import engine, Base, run_migrations
from backend.app.seed_data import seed_database

def main():
    print("=" * 70)
    print("  [SERVICEHUB] HYPERLOCAL ON-DEMAND SERVICE MARKETPLACE")
    print("=" * 70)
    print("Initializing Database Tables & Seed Data...")
    Base.metadata.create_all(bind=engine)
    run_migrations()
    seed_database()
    print("-" * 70)
    print("  Customer Marketplace : http://localhost:8000/")
    print("  Worker Dispatch Hub  : http://localhost:8000/worker")
    print("  Admin Governance Hub : http://localhost:8000/admin")
    print("  Swagger OpenAPI Docs : http://localhost:8000/docs")
    print("-" * 70)
    print("Demo Credentials:")
    print("  Customer: rahul@gmail.com / Rahul@123")
    print("  Plumber : ramesh.plumber@servicehub.com / Worker@123")
    print("  Wireman : mukesh.electrician@servicehub.com / Worker@123")
    print("  Admin   : admin@servicehub.com / Admin@123")
    print("=" * 70)

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=False, app_dir=str(root_dir))

if __name__ == "__main__":
    main()

