from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from ..database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_ref = Column(String(32), unique=True, default=lambda: f"SH-{uuid.uuid4().hex[:8].upper()}", index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    
    service_address = Column(Text, nullable=False)
    city = Column(String(50), default="Ahmedabad")
    locality = Column(String(100), default="Navrangpura")
    scheduled_time = Column(DateTime, default=datetime.utcnow)
    is_instant = Column(Boolean, default=True)
    
    # Lifecycle Status: PENDING -> ACCEPTED -> ARRIVED -> IN_PROGRESS -> COMPLETED -> CANCELLED
    status = Column(String(20), default="PENDING")
    
    total_amount = Column(Float, default=350.0)
    payment_status = Column(String(20), default="UNPAID") # 'UNPAID', 'PAID'
    payment_method = Column(String(50), nullable=True) # 'UPI', 'CARD', 'CASH', 'NETBANKING'
    transaction_ref = Column(String(64), nullable=True)
    paid_at = Column(DateTime, nullable=True)
    
    problem_description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="customer_bookings", foreign_keys=[customer_id])
    worker = relationship("WorkerProfile", back_populates="bookings", foreign_keys=[worker_id])
    category = relationship("ServiceCategory", back_populates="bookings")
    otps = relationship("OTPVerification", back_populates="booking", cascade="all, delete-orphan")
    review = relationship("Review", back_populates="booking", uselist=False)

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False)
    otp_type = Column(String(10), nullable=False) # 'START' or 'END'
    otp_code = Column(String(6), nullable=False)
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="otps")
