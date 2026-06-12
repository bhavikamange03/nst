from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from passlib.hash import pbkdf2_sha256
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
 
router = APIRouter(prefix="/auth", tags=["auth"])


@router.get('/me')
def read_current_user(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "role": current_user.role}



class AddressCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    address: Optional[AddressCreate] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    hashed = pbkdf2_sha256.hash(user_in.password)
    user = User(name=user_in.name, email=user_in.email, password=hashed, role="user")
    db.add(user)
    db.commit()
    db.refresh(user)

    # create address if provided
    if user_in.address:
        try:
            from app.models.address import Address

            addr_in = user_in.address
            addr = Address(
                user_id=user.id,
                first_name=addr_in.first_name,
                last_name=addr_in.last_name,
                street=addr_in.street,
                city=addr_in.city,
                state=addr_in.state,
                zip_code=addr_in.zip_code,
                country=addr_in.country,
                phone=addr_in.phone,
            )
            db.add(addr)
            db.commit()
        except Exception:
            # don't fail registration if optional address creation fails
            db.rollback()

    return user


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    if not pbkdf2_sha256.verify(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}
