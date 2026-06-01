from sqlalchemy import String, ForiegnKey

class Address(Base, TimestampMixin):
    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(primary_key = True)

    user_id : Mapped[int] = mapped_column(
        ForiegnKey("users.id"),
        index = True
    )

    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    street: Mapped[str] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(100))
    zip_code: Mapped[str] = mapped_column(String(20))
    country: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20))
    is_default: Mapped[bool] = mapped_column(default=False)

    user = relationship(
        "User",
        back_populates = "addresses"
    )