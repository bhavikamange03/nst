from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.core.security import decode_access_token

# Primary oauth scheme (required)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Optional oauth scheme for endpoints that allow anonymous access (guest flows)
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def _decode_token_or_none(token: Optional[str]) -> Optional[dict]:
    if not token:
        return None
    try:
        return decode_access_token(token)
    except Exception:
        return None


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = _decode_token_or_none(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.query(User).get(int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)) -> Optional[User]:
    """Return the current user or None if no valid token is provided.

    Use this dependency in endpoints that allow guest access (e.g., checkout for guests).
    """
    payload = _decode_token_or_none(token)
    if not payload:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    user = db.query(User).get(int(user_id))
    return user


def require_role(role: str):
    def _require_role(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role != role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return current_user
    return _require_role


def require_any_role(*roles: str):
    def _require_any(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return current_user
    return _require_any
