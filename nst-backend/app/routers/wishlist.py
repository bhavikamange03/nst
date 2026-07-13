from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.wishlist import Wishlist
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


class WishlistCreate(BaseModel):
    product_id: int


@router.get("/", response_model=list[int])
def list_wishlist(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()
    return [item.product_id for item in items]


@router.post("/", response_model=WishlistCreate, status_code=status.HTTP_201_CREATED)
def add_wishlist_item(data: WishlistCreate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Wishlist).filter(Wishlist.user_id == current_user.id, Wishlist.product_id == data.product_id).first()
    if existing:
        return data

    item = Wishlist(user_id=current_user.id, product_id=data.product_id)
    db.add(item)
    db.commit()
    return data


@router.delete("/{product_id}")
def remove_wishlist_item(product_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(Wishlist).filter(Wishlist.user_id == current_user.id, Wishlist.product_id == product_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"detail": "removed"}
