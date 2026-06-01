from sqlalchemy import ForeignKey, Numeric, Integer

class OrderItem(Base, TimestampMixin):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True)

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id")
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index = True
    )

    quantity: Mapped[int] = mapped_column(Integer)

    price: Mapped[Decimal] = mapped_column(Numeric(10,2))

    order = relationship(
        "Order",
        back_populates="items"
    )

    product = relationship(
        "Product"
    )