from sqlalchemy import ForeignKey, Integer, Text

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