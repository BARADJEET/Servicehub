from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: Optional[str] = "wrench"
    description: Optional[str] = None
    base_price: Optional[float] = 299.0
    is_active: Optional[bool] = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    is_active: Optional[bool] = None

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
