from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.session import engine

# Import all models
from app.models.user import User
from app.models.address import Address
from app.models.product import Product
from app.models.productVariant import ProductVariant
from app.models.productImage import ProductImage
from app.models.category import Category
from app.models.cart import Cart
from app.models.cartItem import CartItem
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.models.payment import Payment
from app.models.wishlist import Wishlist
from app.models.review import Review

from app.routers import auth
from app.routers import admin
from app.routers import wishlist
from app.routers import orders

# Create tables (wrapped for safety)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create tables: {e}")
    print("Continuing anyway - tables may not exist yet")

app = FastAPI()

# Enable CORS FIRST (must be before routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(wishlist.router)
app.include_router(orders.router)

@app.get("/")
def root():
    return {"message": "NST API Running"}