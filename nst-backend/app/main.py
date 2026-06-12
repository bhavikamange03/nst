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

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS for frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "NST API Running"}