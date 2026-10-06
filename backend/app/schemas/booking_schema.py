from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .auth_schema import UserResponse
from .worker_schema import WorkerResponse
from .category_schema import CategoryResponse

class BookingCreate(BaseModel):
    worker_id: int
    category_id: int
    service_address: str
    city: Optional[str] = "Ahmedabad"
    locality: Optional[str] = "Navrangpura"
    is_instant: Optional[bool] = True
    scheduled_time: Optional[datetime] = None
    problem_description: Optional[str] = None

class OTPVerifyRequest(BaseModel):
    otp_code: str

class PaymentRequest(BaseModel):
    payment_method: str # 'UPI', 'CARD', 'CASH', 'NETBANKING'
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None

class OTPResponse(BaseModel):
    otp_type: str
    otp_code: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class BookingResponse(BaseModel):
    id: int
    booking_ref: str
    customer_id: int
    worker_id: int
    category_id: int
    service_address: str
    city: str
    locality: str
    scheduled_time: datetime
    is_instant: bool
    status: str
    total_amount: float
    payment_status: Optional[str] = "UNPAID"
    payment_method: Optional[str] = None
    transaction_ref: Optional[str] = None
    paid_at: Optional[datetime] = None
    problem_description: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    customer: Optional[UserResponse] = None
    worker: Optional[WorkerResponse] = None
    category: Optional[CategoryResponse] = None
    otps: Optional[List[OTPResponse]] = []

    class Config:
        from_attributes = True
