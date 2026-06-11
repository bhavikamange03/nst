from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key = True)

    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index = True
    )
    password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(default="user")

    addresses = relationship(
        "Address",
        back_populates = "user",
        cascade = "all, delete-orphan"
    )

    orders = relationship(
        "Order",
        back_populates = "user"
    )

    reviews = relationship(
        "Review",
        back_populates = "user"
    )

    wishlist_items = relationship(
        "Wishlist",
        back_populates = "user"
    )