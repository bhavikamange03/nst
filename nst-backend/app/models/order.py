from sqlalchemy import ForeignKey, Numeric, String

class Order(Base, TimestampMixin):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        index = True
    )

    total_amount: Mapped[Decimal] = mapped_column(Numeric(10,2))

    status: Mapped[str] = mapped_column(
        String(50),
        default="Pending"
    )

    user = relationship(
        "User",
        back_populates="orders"
    )

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )