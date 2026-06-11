from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index = True
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index = True
    )

    rating: Mapped[int] = mapped_column(Integer)

    comment: Mapped[str] = mapped_column(Text)

    user = relationship(
        "User",
        back_populates="reviews"
    )

    product = relationship(
        "Product",
        back_populates="reviews"
    )