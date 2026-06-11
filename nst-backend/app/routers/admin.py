from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.core.dependencies import require_role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=List[dict])
def list_users(db: Session = Depends(get_db), _=Depends(require_role("admin"))):
    """Admin-only: list all users (minimal fields)."""
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "role": u.role} for u in users]
