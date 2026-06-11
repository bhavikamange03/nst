from sqlalchemy import ForeignKey, Float, String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Float)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        index = True
    )

    category = relationship(
        "Category",
        back_populates="products"
    )

    images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    reviews = relationship(
        "Review",
        back_populates="product"
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
