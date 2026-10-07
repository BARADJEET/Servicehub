import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine, Base, run_migrations
from .config import BASE_DIR, UPLOAD_DIR
from .routers import auth, categories, workers, bookings, reviews, admin

# Create DB tables & ensure schema migrations
Base.metadata.create_all(bind=engine)
run_migrations()

app = FastAPI(
    title="ServiceHub — Hyperlocal On-Demand Service Marketplace",
    description="Backend REST API for Customer, Worker & Admin portals with Two-Stage OTP verification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static & Upload Folders
FRONTEND_DIR = BASE_DIR.parent / "frontend"
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include API Routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(workers.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(admin.router)

@app.get("/api/health")
def health_check():
    return {"status": "online", "app": "ServiceHub Marketplace", "version": "1.0.0"}

# Serve HTML SPA Pages
@app.get("/")
def serve_customer_home():
    return FileResponse(FRONTEND_DIR / "index.html")

@app.get("/worker")
@app.get("/worker/register")
@app.get("/register-worker")
def serve_worker_portal():
    return FileResponse(FRONTEND_DIR / "worker.html")

@app.get("/admin")
def serve_admin_portal():
    return FileResponse(FRONTEND_DIR / "admin.html")
