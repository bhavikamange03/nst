from sqlalchemy import ForeignKey, String

class ProductImage(Base, TimestampMixin):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        index = True
    )

    image_url: Mapped[str] = mapped_column(String(500))

    product = relationship(
        "Product",
        back_populates="images"
    )