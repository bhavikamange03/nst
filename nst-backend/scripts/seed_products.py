#!/usr/bin/env python3
"""Seed backend product data from frontend static product list.

Usage:
  cd nst-backend
  DATABASE_URL="postgresql://user:password@localhost:5432/nst" python scripts/seed_products.py
"""
import json
import os
import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.database.session import SessionLocal
from app.models.address import Address
from app.models.cart import Cart
from app.models.cartItem import CartItem
from app.models.category import Category
from app.models.order import Order
from app.models.orderItem import OrderItem
from app.models.payment import Payment
from app.models.product import Product
from app.models.productImage import ProductImage
from app.models.productVariant import ProductVariant
from app.models.review import Review
from app.models.user import User
from app.models.wishlist import Wishlist


def load_frontend_products():
    frontend_file = PROJECT_ROOT.parent / 'nst-frontend' / 'src' / 'data' / 'product.js'
    if not frontend_file.exists():
        raise FileNotFoundError(f"Frontend product data file not found: {frontend_file}")

    text = frontend_file.read_text(encoding='utf-8')
    text = re.sub(r"^const\s+products\s*=\s*", '', text, flags=re.MULTILINE)
    text = re.sub(r"export\s+default\s+\w+;?", '', text, flags=re.MULTILINE)
    text = text.strip()
    if text.endswith(';'):
        text = text[:-1]

    # Convert simple JS object literal syntax into valid JSON.
    def js_to_json(js_text: str) -> str:
        out = []
        i = 0
        in_string = False
        string_delim = ''
        escaped = False

        while i < len(js_text):
            ch = js_text[i]
            if in_string:
                out.append(ch)
                if escaped:
                    escaped = False
                elif ch == '\\':
                    escaped = True
                elif ch == string_delim:
                    in_string = False
                i += 1
                continue

            if ch in ('"', "'"):
                in_string = True
                string_delim = ch
                out.append(ch)
                i += 1
                continue

            if re.match(r'[A-Za-z_]', ch):
                start = i
                while i < len(js_text) and re.match(r'[A-Za-z0-9_]', js_text[i]):
                    i += 1
                key = js_text[start:i]
                j = i
                while j < len(js_text) and js_text[j].isspace():
                    j += 1
                if j < len(js_text) and js_text[j] == ':':
                    out.append(f'"{key}"')
                    continue
                out.append(key)
                continue

            out.append(ch)
            i += 1

        converted = ''.join(out)
        converted = re.sub(r',\s*([}\]])', r'\1', converted)
        return converted

    text = js_to_json(text)
    return json.loads(text)


def main():
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///./nst.db')
    print(f'Using database URL: {db_url}')
    print('Loading frontend product definitions...')
    products = load_frontend_products()
    if not isinstance(products, list):
        raise ValueError('Expected an array of product objects')

    with SessionLocal() as db:
        created = 0
        updated = 0
        for product_data in products:
            category_name = product_data.get('category', 'Uncategorized')
            category = db.query(Category).filter(Category.name == category_name).first()
            if not category:
                category = Category(name=category_name)
                db.add(category)
                db.flush()

            product = db.query(Product).filter(Product.id == product_data['id']).first()
            if not product:
                product = Product(
                    id=product_data['id'],
                    name=product_data['name'],
                    description=product_data.get('description', ''),
                    price=product_data.get('price', 0.0),
                    category_id=category.id,
                )
                db.add(product)
                db.flush()
                created += 1
            else:
                product.name = product_data['name']
                product.description = product_data.get('description', '')
                product.price = product_data.get('price', 0.0)
                product.category_id = category.id
                updated += 1

            existing_images = {img.image_url for img in product.images}
            for image_url in product_data.get('images', []):
                if image_url in existing_images:
                    continue
                db.add(ProductImage(product_id=product.id, image_url=image_url))

        db.commit()
        print(f'Seeding complete: {created} created, {updated} updated.')


if __name__ == '__main__':
    main()
