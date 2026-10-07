from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User, WorkerProfile
from ..schemas.auth_schema import UserRegister, UserLogin, UserResponse, Token
from ..services.auth_service import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if payload.phone:
        clean_phone = "".join(c for c in payload.phone if c.isdigit())
        if len(clean_phone) != 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number must be exactly 10 digits"
            )
        payload.phone = clean_phone

    existing = db.query(User).filter((User.email == payload.email) | (User.phone == payload.phone)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or phone number already exists"
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email.lower().strip(),
        phone=payload.phone,
        hashed_password=get_password_hash(payload.password),
        role=payload.role or "customer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.id, "role": user.role})
    return Token(access_token=token, token_type="bearer", user=user)

@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    identifier = (payload.email_or_phone or payload.email or "").strip()
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide an email address or 10-digit mobile number"
        )

    # Check if identifier is a phone number (numeric digits without @)
    clean_digits = "".join(c for c in identifier if c.isdigit())
    is_phone_attempt = "@" not in identifier and len(clean_digits) > 0

    if is_phone_attempt:
        if len(clean_digits) != 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number must be exactly 10 digits"
            )
        user = db.query(User).filter(User.phone == clean_digits).first()
    else:
        user = db.query(User).filter(User.email == identifier.lower()).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/mobile number or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated by administrator"
        )

    token = create_access_token(data={"sub": user.id, "role": user.role})
    return Token(access_token=token, token_type="bearer", user=user)

@router.get("/me", response_model=UserResponse)
def get_current_profile(current_user: User = Depends(get_current_user)):
    return current_user
