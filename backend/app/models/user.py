from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="customer") # customer, worker, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    customer_bookings = relationship("Booking", back_populates="customer", foreign_keys="Booking.customer_id")
    customer_reviews = relationship("Review", back_populates="customer")

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("service_categories.id"), nullable=False)
    experience_years = Column(Integer, default=1)
    hourly_rate = Column(Float, default=300.0)
    bio = Column(Text, nullable=True)
    city = Column(String(50), default="Ahmedabad")
    locality = Column(String(100), default="Navrangpura")
    id_proof_url = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    rating_avg = Column(Float, default=5.0)
    total_reviews = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="worker_profile")
    category = relationship("ServiceCategory", back_populates="workers")
    bookings = relationship("Booking", back_populates="worker", foreign_keys="Booking.worker_id")
    reviews = relationship("Review", back_populates="worker")
