from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.category import ServiceCategory
from ..schemas.category_schema import CategoryResponse, CategoryCreate, CategoryUpdate
from ..services.auth_service import require_admin

router = APIRouter(prefix="/api/categories", tags=["Service Categories"])

@router.get("/", response_model=List[CategoryResponse])
def list_categories(active_only: bool = True, db: Session = Depends(get_db)):
    query = db.query(ServiceCategory)
    if active_only:
        query = query.filter(ServiceCategory.is_active == True)
    return query.order_by(ServiceCategory.name.asc()).all()

@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(ServiceCategory).filter(ServiceCategory.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), admin = Depends(require_admin)):
    existing = db.query(ServiceCategory).filter(ServiceCategory.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    cat = ServiceCategory(**payload.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat
