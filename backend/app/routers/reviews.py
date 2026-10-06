from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from ..models.user import User, WorkerProfile
from ..models.booking import Booking
from ..models.review import Review
from ..schemas.review_schema import ReviewCreate, ReviewResponse
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/api/reviews", tags=["Reviews & Ratings"])

@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_review(payload: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == payload.booking_id, Booking.customer_id == current_user.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this customer")
    if booking.status != "COMPLETED":
        raise HTTPException(status_code=400, detail="Cannot review a booking that is not completed")

    existing = db.query(Review).filter(Review.booking_id == booking.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Review already submitted for this booking")

    review = Review(
        booking_id=booking.id,
        customer_id=current_user.id,
        worker_id=booking.worker_id,
        rating=max(1, min(5, payload.rating)),
        review_text=payload.review_text
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Recalculate Worker average rating
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == booking.worker_id).first()
    if worker:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.worker_id == worker.id).scalar() or 5.0
        total_revs = db.query(func.count(Review.id)).filter(Review.worker_id == worker.id).scalar() or 0
        worker.rating_avg = round(float(avg_rating), 1)
        worker.total_reviews = total_revs
        db.commit()

    return review

@router.get("/worker/{worker_id}", response_model=List[ReviewResponse])
def get_worker_reviews(worker_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.worker_id == worker_id).order_by(Review.created_at.desc()).all()
