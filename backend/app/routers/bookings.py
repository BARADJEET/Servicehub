from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models.user import User, WorkerProfile
from ..models.category import ServiceCategory
from ..models.booking import Booking, OTPVerification
from ..schemas.booking_schema import BookingCreate, BookingResponse, OTPVerifyRequest, OTPResponse, PaymentRequest
from ..services.auth_service import get_current_user, require_worker
from ..services.booking_service import BookingService

router = APIRouter(prefix="/api/bookings", tags=["Bookings & OTP Security"])

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "worker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Technicians and service workers cannot book services. Please log in with a customer account to make bookings."
        )

    worker = db.query(WorkerProfile).filter(WorkerProfile.id == payload.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    if worker.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Technicians cannot hire or book their own service profile."
        )
    if not worker.is_available:
        raise HTTPException(status_code=400, detail="Worker is currently marked unavailable")

    category = db.query(ServiceCategory).filter(ServiceCategory.id == payload.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    booking = Booking(
        customer_id=current_user.id,
        worker_id=payload.worker_id,
        category_id=payload.category_id,
        service_address=payload.service_address,
        city=payload.city or worker.city,
        locality=payload.locality or worker.locality,
        is_instant=payload.is_instant if payload.is_instant is not None else True,
        scheduled_time=payload.scheduled_time or datetime.utcnow(),
        status="PENDING",
        total_amount=worker.hourly_rate or category.base_price,
        problem_description=payload.problem_description
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/my", response_model=List[BookingResponse])
def get_my_bookings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "worker":
        # Workers do not have customer bookings; their assigned dispatch jobs are accessed via /worker-jobs
        return []

    bookings = db.query(Booking).filter(Booking.customer_id == current_user.id).order_by(Booking.created_at.desc()).all()

    # Guarantee End OTP is generated instantly for any IN_PROGRESS booking
    modified = False
    for b in bookings:
        if b.status == "IN_PROGRESS":
            has_end = any(o.otp_type == "END" for o in b.otps)
            if not has_end:
                end_otp = OTPVerification(
                    booking_id=b.id,
                    otp_type="END",
                    otp_code=BookingService.generate_otp_code(),
                    is_verified=False
                )
                db.add(end_otp)
                modified = True
    if modified:
        db.commit()
        for b in bookings:
            db.refresh(b)

    return bookings

@router.get("/worker-jobs", response_model=List[BookingResponse])
def get_worker_jobs(current_user: User = Depends(require_worker), db: Session = Depends(get_db)):
    worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if not worker:
        return []
    bookings = db.query(Booking).filter(Booking.worker_id == worker.id).order_by(Booking.created_at.desc()).all()

    # Guarantee End OTP is generated instantly for any IN_PROGRESS booking
    modified = False
    for b in bookings:
        if b.status == "IN_PROGRESS":
            has_end = any(o.otp_type == "END" for o in b.otps)
            if not has_end:
                end_otp = OTPVerification(
                    booking_id=b.id,
                    otp_type="END",
                    otp_code=BookingService.generate_otp_code(),
                    is_verified=False
                )
                db.add(end_otp)
                modified = True
    if modified:
        db.commit()
        for b in bookings:
            db.refresh(b)

    # CRITICAL SECURITY RULE: Workers must NEVER see raw customer OTP codes!
    # The customer holds the OTP and gives it verbally at doorstep upon arrival and completion.
    sanitized_bookings = []
    for b in bookings:
        resp = BookingResponse.model_validate(b)
        if resp.otps:
            for o in resp.otps:
                o.otp_code = "****" # Masked: workers cannot peek at customer OTPs
        sanitized_bookings.append(resp)

    return sanitized_bookings

@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking_details(booking_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if current_user.role == "worker":
        worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
        if not worker or booking.worker_id != worker.id:
            raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        resp = BookingResponse.model_validate(booking)
        if resp.otps:
            for o in resp.otps:
                o.otp_code = "****"
        return resp
    else:
        if booking.customer_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Not authorized to view this booking")
        return booking

@router.post("/{booking_id}/accept", response_model=BookingResponse)
def accept_booking(booking_id: int, current_user: User = Depends(require_worker), db: Session = Depends(get_db)):
    worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.worker_id == worker.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this worker")
    if booking.status != "PENDING":
        raise HTTPException(status_code=400, detail=f"Cannot accept booking in status '{booking.status}'")

    booking.status = "ACCEPTED"
    db.commit()
    db.refresh(booking)
    return booking

@router.post("/{booking_id}/arrived", response_model=BookingResponse)
def mark_arrival_and_generate_start_otp(
    booking_id: int,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.worker_id == worker.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this worker")

    BookingService.trigger_arrival_and_generate_start_otp(db, booking)
    return booking

@router.post("/{booking_id}/verify-start-otp", response_model=BookingResponse)
def verify_start_otp(
    booking_id: int,
    payload: OTPVerifyRequest,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.worker_id == worker.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this worker")

    BookingService.verify_start_otp(db, booking, payload.otp_code)
    return booking

@router.post("/{booking_id}/request-completion", response_model=BookingResponse)
def request_completion_and_generate_end_otp(
    booking_id: int,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.worker_id == worker.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this worker")

    BookingService.request_completion_and_generate_end_otp(db, booking)
    return booking

@router.post("/{booking_id}/verify-end-otp", response_model=BookingResponse)
def verify_end_otp(
    booking_id: int,
    payload: OTPVerifyRequest,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    booking = db.query(Booking).filter(Booking.id == booking_id, Booking.worker_id == worker.id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this worker")

    BookingService.verify_end_otp(db, booking, payload.otp_code)
    return booking

@router.post("/{booking_id}/pay", response_model=BookingResponse)
def pay_for_booking(
    booking_id: int,
    payload: PaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    import uuid
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    worker_user_id = booking.worker.user_id if booking.worker else None
    if current_user.id != booking.customer_id and current_user.id != worker_user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to settle or record payment for this booking")

    if booking.status != "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot settle payment for booking in '{booking.status}' status. Service must be verified as COMPLETED first."
        )

    if booking.payment_status == "PAID":
        raise HTTPException(status_code=400, detail="This booking has already been paid and settled.")

    booking.payment_status = "PAID"
    booking.payment_method = payload.payment_method
    booking.transaction_ref = payload.transaction_ref or f"TXN-SH-{uuid.uuid4().hex[:8].upper()}"
    booking.paid_at = datetime.utcnow()
    if payload.notes:
        booking.notes = (booking.notes or "") + f" [Payment: {payload.notes}]"

    db.commit()
    db.refresh(booking)
    return booking

@router.post("/upload-qr")
def upload_payment_qr(file: UploadFile = File(...)):
    import shutil
    from ..config import BASE_DIR
    target_path = BASE_DIR.parent / "frontend" / "images" / "payment_qr.png"
    target_path.parent.mkdir(parents=True, exist_ok=True)
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {
        "status": "success",
        "message": "Custom payment QR Code uploaded successfully",
        "qr_url": "/static/images/payment_qr.png"
    }


