from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50), default="wrench") # Lucide icon name
    description = Column(Text, nullable=True)
    base_price = Column(Float, default=299.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    workers = relationship("WorkerProfile", back_populates="category")
    bookings = relationship("Booking", back_populates="category")
