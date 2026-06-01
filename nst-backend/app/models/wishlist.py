from sqlalchemy import ForeignKey

class Wishlist(Base, TimestampMixin):
    __tablename__ = "wishlists"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index = True
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index = True
    )

    address_id = mapped_column(
        ForeignKey("addresses.id")
    )

    user = relationship(
        "User",
        back_populates="wishlist_items"
    )

    product = relationship(
        "Product"
    )