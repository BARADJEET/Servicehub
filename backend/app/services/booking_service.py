import random
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models.booking import Booking, OTPVerification
from ..models.user import WorkerProfile

class BookingService:
    @staticmethod
    def generate_otp_code() -> str:
        # Generates a secure 4-digit code e.g. '4821'
        return f"{random.randint(1000, 9999)}"

    @staticmethod
    def trigger_arrival_and_generate_start_otp(db: Session, booking: Booking) -> OTPVerification:
        if booking.status != "ACCEPTED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot mark arrival for booking in status '{booking.status}'. Must be 'ACCEPTED'."
            )
        
        # Check if Start OTP already exists
        existing_otp = db.query(OTPVerification).filter(
            OTPVerification.booking_id == booking.id,
            OTPVerification.otp_type == "START"
        ).first()

        if not existing_otp:
            start_otp = OTPVerification(
                booking_id=booking.id,
                otp_type="START",
                otp_code=BookingService.generate_otp_code(),
                is_verified=False
            )
            db.add(start_otp)
        else:
            start_otp = existing_otp

        booking.status = "ARRIVED"
        db.commit()
        db.refresh(booking)
        db.refresh(start_otp)
        return start_otp

    @staticmethod
    def verify_start_otp(db: Session, booking: Booking, entered_code: str) -> bool:
        if booking.status != "ARRIVED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Booking is not in ARRIVED status"
            )

        start_otp = db.query(OTPVerification).filter(
            OTPVerification.booking_id == booking.id,
            OTPVerification.otp_type == "START"
        ).first()

        if not start_otp or start_otp.otp_code != entered_code.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Start OTP code. Please ask customer for correct 4-digit code."
            )

        start_otp.is_verified = True
        start_otp.verified_at = datetime.utcnow()
        booking.status = "IN_PROGRESS"
        db.commit()
        db.refresh(booking)
        return True

    @staticmethod
    def request_completion_and_generate_end_otp(db: Session, booking: Booking) -> OTPVerification:
        if booking.status != "IN_PROGRESS":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot complete booking in status '{booking.status}'. Must be 'IN_PROGRESS'."
            )

        existing_otp = db.query(OTPVerification).filter(
            OTPVerification.booking_id == booking.id,
            OTPVerification.otp_type == "END"
        ).first()

        if not existing_otp:
            end_otp = OTPVerification(
                booking_id=booking.id,
                otp_type="END",
                otp_code=BookingService.generate_otp_code(),
                is_verified=False
            )
            db.add(end_otp)
        else:
            end_otp = existing_otp

        db.commit()
        db.refresh(end_otp)
        return end_otp

    @staticmethod
    def verify_end_otp(db: Session, booking: Booking, entered_code: str) -> bool:
        if booking.status != "IN_PROGRESS":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Booking is not in IN_PROGRESS status"
            )

        end_otp = db.query(OTPVerification).filter(
            OTPVerification.booking_id == booking.id,
            OTPVerification.otp_type == "END"
        ).first()

        if not end_otp or end_otp.otp_code != entered_code.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid End OTP code. Please ask customer to inspect work and provide 4-digit code."
            )

        end_otp.is_verified = True
        end_otp.verified_at = datetime.utcnow()
        booking.status = "COMPLETED"

        # Update worker earnings
        worker_profile = db.query(WorkerProfile).filter(WorkerProfile.id == booking.worker_id).first()
        if worker_profile:
            worker_profile.total_earnings += (booking.total_amount or 350.0)

        db.commit()
        db.refresh(booking)
        return True
