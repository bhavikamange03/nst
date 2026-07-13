from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, conint
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.models.payment import Payment
from app.models.product import Product
from app.models.user import User

router = APIRouter(prefix="/orders", tags=["orders"])


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: conint(gt=0)


class PaymentData(BaseModel):
    payment_method: str
    card_holder_name: str
    card_number: str
    expiry_month: str
    expiry_year: str
    cvc: str


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    payment: PaymentData


class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

    class Config:
        orm_mode = True


class PaymentOut(BaseModel):
    transaction_id: str
    payment_method: str
    status: str
    amount: Decimal

    class Config:
        orm_mode = True


class OrderOut(BaseModel):
    id: int
    total_amount: Decimal
    status: str
    items: List[OrderItemOut]
    payment: Optional[PaymentOut] = None

    class Config:
        orm_mode = True


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not data.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain at least one item")

    product_ids = [item.product_id for item in data.items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    products_map = {product.id: product for product in products}

    missing = [pid for pid in product_ids if pid not in products_map]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Products not found: {', '.join(map(str, missing))}",
        )

    total_amount = Decimal('0.00')
    for item in data.items:
        product = products_map[item.product_id]
        total_amount += Decimal(str(product.price)) * item.quantity

    if data.payment.payment_method.lower() not in ["card", "upi", "paypal"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported payment method")

    if len(data.payment.card_number) < 12:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid card number")
    if len(data.payment.cvc) < 3:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid CVC")

    order = Order(user_id=current_user.id, total_amount=total_amount, status="Paid")
    db.add(order)
    db.flush()

    for item in data.items:
        product = products_map[item.product_id]
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=Decimal(str(product.price)),
        )
        db.add(order_item)

    payment = Payment(
        order_id=order.id,
        amount=total_amount,
        transaction_id=f"TXN-{order.id}-{int(datetime.utcnow().timestamp())}",
        status="Paid",
        payment_method=data.payment.payment_method,
    )
    db.add(payment)

    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=List[OrderOut])
def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order
