from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import uuid
from pathlib import Path
from ..config import UPLOAD_DIR
from ..database import get_db
from ..models.user import User, WorkerProfile
from ..models.category import ServiceCategory
from ..schemas.worker_schema import WorkerRegister, WorkerResponse, WorkerProfileUpdate
from ..schemas.auth_schema import Token
from ..services.auth_service import get_password_hash, create_access_token, get_current_user, require_worker
from ..services.matching_service import MatchingService

router = APIRouter(prefix="/api/workers", tags=["Workers"])

@router.get("/search", response_model=List[WorkerResponse])
def search_workers(
    category_id: Optional[int] = None,
    city: Optional[str] = None,
    locality: Optional[str] = None,
    only_verified: bool = True,
    db: Session = Depends(get_db)
):
    return MatchingService.search_workers(db, category_id, city, locality, only_verified)

@router.get("/profile/{worker_id}", response_model=WorkerResponse)
def get_worker_profile(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(WorkerProfile).filter(WorkerProfile.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    return worker

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_worker(payload: WorkerRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.email == payload.email) | (User.phone == payload.phone)).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email/phone already exists")

    cat = db.query(ServiceCategory).filter(ServiceCategory.id == payload.category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Selected service category not found")

    user = User(
        full_name=payload.full_name,
        email=payload.email.lower().strip(),
        phone=payload.phone,
        hashed_password=get_password_hash(payload.password),
        role="worker"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = WorkerProfile(
        user_id=user.id,
        category_id=payload.category_id,
        experience_years=payload.experience_years,
        hourly_rate=payload.hourly_rate,
        bio=payload.bio,
        city=payload.city or "Ahmedabad",
        locality=payload.locality or "Navrangpura",
        aadhaar_number=payload.aadhaar_number,
        id_proof_url=payload.id_proof_url,
        is_verified=False # Requires admin review
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    token = create_access_token(data={"sub": user.id, "role": "worker"})
    return Token(access_token=token, token_type="bearer", user=user)

@router.post("/upload-aadhaar-public")
def upload_aadhaar_public(file: UploadFile = File(...)):
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    file_ext = Path(file.filename).suffix or ".jpg"
    dest_name = f"aadhaar_{uuid.uuid4().hex[:12]}{file_ext}"
    dest_path = UPLOAD_DIR / dest_name

    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "status": "success",
        "file_url": f"/uploads/{dest_name}",
        "filename": file.filename
    }

@router.post("/upload-id", response_model=WorkerResponse)
def upload_kyc_document(
    file: UploadFile = File(...),
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    file_ext = Path(file.filename).suffix or ".jpg"
    dest_name = f"kyc_{uuid.uuid4().hex[:12]}{file_ext}"
    dest_path = UPLOAD_DIR / dest_name

    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    profile.id_proof_url = f"/uploads/{dest_name}"
    db.commit()
    db.refresh(profile)
    return profile

@router.patch("/me/profile", response_model=WorkerResponse)
def update_own_profile(
    payload: WorkerProfileUpdate,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    for key, val in payload.dict(exclude_unset=True).items():
        setattr(profile, key, val)

    db.commit()
    db.refresh(profile)
    return profile
