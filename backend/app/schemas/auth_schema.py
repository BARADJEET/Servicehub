from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    password: str
    role: Optional[str] = "customer" # customer, worker, admin

class UserLogin(BaseModel):
    email: Optional[str] = None
    email_or_phone: Optional[str] = None
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
