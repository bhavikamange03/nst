from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Wishlist(Base, TimestampMixin):
    __tablename__ = "wishlists"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index=True,
        nullable=False,
    )

    address_id = mapped_column(
        ForeignKey("addresses.id"),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="wishlist_items"
    )

    product = relationship(
        "Product"
    )