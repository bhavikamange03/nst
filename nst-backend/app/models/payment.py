from sqlalchemy import Numeric, ForeignKey, String

class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id")
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(10,2))

    transaction_id: Mapped[str] = mapped_column(
        String(255)
    )

    status: Mapped[str] = mapped_column(
        String(50)
    )

    payment_method: Mapped[str] = mapped_column(
        String(50)
    )

    order = relationship("Order")