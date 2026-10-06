from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .auth_schema import UserResponse

class ReviewCreate(BaseModel):
    booking_id: int
    rating: int # 1 to 5
    review_text: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    booking_id: int
    customer_id: int
    worker_id: int
    rating: int
    review_text: Optional[str] = None
    created_at: datetime
    customer: Optional[UserResponse] = None

    class Config:
        from_attributes = True
