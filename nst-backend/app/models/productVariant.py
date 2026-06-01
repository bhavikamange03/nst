from sqlalchemy import ForeignKey, Integer, String

class ProductVariant(Base, TimestampMixin):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index = True
    )

    color: Mapped[str] = mapped_column(String(50))
    size: Mapped[str] = mapped_column(String(50))
    stock: Mapped[int] = mapped_column(Integer)

    sku: Mapped[str] = mapped_column(String(100), unique = True, index = True)
    product = relationship(
        "Product",
        back_populates="variants"
    )