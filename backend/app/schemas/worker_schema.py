from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .auth_schema import UserResponse
from .category_schema import CategoryResponse

class WorkerRegister(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    category_id: int
    experience_years: int
    hourly_rate: float
    bio: Optional[str] = None
    city: Optional[str] = "Ahmedabad"
    locality: Optional[str] = "Navrangpura"

class WorkerProfileUpdate(BaseModel):
    hourly_rate: Optional[float] = None
    bio: Optional[str] = None
    is_available: Optional[bool] = None
    experience_years: Optional[int] = None
    city: Optional[str] = None
    locality: Optional[str] = None

class WorkerResponse(BaseModel):
    id: int
    user_id: int
    category_id: int
    experience_years: int
    hourly_rate: float
    bio: Optional[str] = None
    city: str
    locality: str
    id_proof_url: Optional[str] = None
    is_verified: bool
    is_available: bool
    is_featured: bool
    rating_avg: float
    total_reviews: int
    total_earnings: float
    created_at: datetime
    user: Optional[UserResponse] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
