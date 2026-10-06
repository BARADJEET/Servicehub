from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from ..database import get_db
from ..models.user import User, WorkerProfile
from ..models.category import ServiceCategory
from ..models.booking import Booking
from ..schemas.worker_schema import WorkerResponse
from ..schemas.booking_schema import BookingResponse
from ..schemas.admin_schema import AdminDashboardKPI
from ..services.auth_service import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

@router.get("/dashboard", response_model=AdminDashboardKPI)
def get_admin_dashboard(db: Session = Depends(get_db), admin = Depends(require_admin)):
    total_cust = db.query(User).filter(User.role == "customer").count()
    total_workers = db.query(WorkerProfile).count()
    verified_workers = db.query(WorkerProfile).filter(WorkerProfile.is_verified == True).count()
    pending_verif = db.query(WorkerProfile).filter(WorkerProfile.is_verified == False).count()
    total_bookings = db.query(Booking).count()
    completed_bookings = db.query(Booking).filter(Booking.status == "COMPLETED").count()
    total_revenue = db.query(func.sum(Booking.total_amount)).filter(Booking.status == "COMPLETED").scalar() or 0.0
    paid_revenue = db.query(func.sum(Booking.total_amount)).filter(Booking.payment_status == "PAID").scalar() or 0.0
    pending_revenue = max(0.0, float(total_revenue) - float(paid_revenue))

    recent_b = db.query(Booking).order_by(Booking.created_at.desc()).limit(8).all()
    recent_list = [
        {
            "id": b.id,
            "ref": b.booking_ref,
            "customer": b.customer.full_name if b.customer else "N/A",
            "worker": b.worker.user.full_name if b.worker and b.worker.user else "N/A",
            "category": b.category.name if b.category else "N/A",
            "amount": b.total_amount,
            "status": b.status,
            "payment_status": b.payment_status or "UNPAID",
            "payment_method": b.payment_method or "-",
            "created_at": b.created_at.strftime("%d %b %Y, %I:%M %p")
        }
        for b in recent_b
    ]

    cats = db.query(ServiceCategory.name, func.count(Booking.id)).join(Booking, Booking.category_id == ServiceCategory.id, isouter=True).group_by(ServiceCategory.name).all()
    cat_dist = {name: count for name, count in cats}

    return AdminDashboardKPI(
        total_customers=total_cust,
        total_workers=total_workers,
        verified_workers=verified_workers,
        pending_verifications=pending_verif,
        total_bookings=total_bookings,
        completed_bookings=completed_bookings,
        total_revenue=round(float(total_revenue), 2),
        paid_revenue=round(float(paid_revenue), 2),
        pending_revenue=round(float(pending_revenue), 2),
        recent_bookings=recent_list,
        category_distribution=cat_dist
    )

@router.get("/workers/pending", response_model=List[WorkerResponse])
def get_pending_workers(db: Session = Depends(get_db), admin = Depends(require_admin)):
    return db.query(WorkerProfile).filter(WorkerProfile.is_verified == False).all()

@router.patch("/workers/{worker_id}/verify", response_model=WorkerResponse)
def verify_worker(worker_id: int, status_verify: bool = True, db: Session = Depends(get_db), admin = Depends(require_admin)):
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    worker.is_verified = status_verify
    db.commit()
    db.refresh(worker)
    return worker

@router.patch("/workers/{worker_id}/feature", response_model=WorkerResponse)
def toggle_feature_worker(worker_id: int, is_featured: bool = True, db: Session = Depends(get_db), admin = Depends(require_admin)):
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    worker.is_featured = is_featured
    db.commit()
    db.refresh(worker)
    return worker
