from sqlalchemy import ForeignKey, Integer

class CartItem(Base, TimestampMixin):
    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True)

    cart_id: Mapped[int] = mapped_column(
        ForeignKey("carts.id")
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index = True
    )

    quantity: Mapped[int] = mapped_column(Integer)

    cart = relationship(
        "Cart",
        back_populates="items"
    )

    product = relationship(
        "Product"
    )