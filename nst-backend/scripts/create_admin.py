#!/usr/bin/env python3
"""Create an initial admin user.

Usage:
  python scripts/create_admin.py --email admin@example.com --password secret --name Admin

The script imports all models to ensure SQLAlchemy mappings are registered,
then uses the project's SessionLocal to insert the user.
"""
import argparse
import sys
import pkgutil
import importlib
from pathlib import Path

from passlib.hash import pbkdf2_sha256

# Ensure project root is on sys.path so "import app" works when running the script
PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app.database import session as db_session


def import_models():
    try:
        import app.models as models_pkg
    except Exception as e:
        print("Failed to import app.models:", e)
        return
    for finder, name, ispkg in pkgutil.iter_modules(models_pkg.__path__):
        try:
            importlib.import_module(f"app.models.{name}")
        except Exception as e:
            # continue importing other modules even if one fails
            print(f"Warning: failed to import app.models.{name}: {e}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--name", default="Admin")
    parser.add_argument("--role", default="admin")
    args = parser.parse_args()

    import_models()

    # Import User model after models are registered. If ORM import fails due to
    # incomplete model imports or mapper errors, fall back to raw SQL to create
    # the user record directly.
    SessionLocal = db_session.SessionLocal
    db = SessionLocal()
    try:
        try:
            from app.models.user import User
            # Try ORM path
            existing = db.query(User).filter(User.email == args.email).first()
            if existing:
                print(f"User with email {args.email} already exists (id={existing.id}, role={existing.role}).")
                return

            hashed = pbkdf2_sha256.hash(args.password)
            user = User(name=args.name, email=args.email, password=hashed, role=args.role)
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user id={user.id} email={user.email} role={user.role}")
            return
        except Exception as orm_err:
            print("ORM path failed, falling back to raw SQL insertion:", orm_err)
            # Raw SQL fallback
            from sqlalchemy import text
            engine = db_session.engine
            hashed = pbkdf2_sha256.hash(args.password)
            with engine.connect() as conn:
                # check existing
                res = conn.execute(text("SELECT id, role FROM users WHERE email = :email"), {"email": args.email}).fetchone()
                if res:
                    print(f"User with email {args.email} already exists (id={res[0]}, role={res[1]}).")
                    return
                conn.execute(
                    text(
                        "INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (:name, :email, :password, :role, now(), now())"
                    ),
                    {"name": args.name, "email": args.email, "password": hashed, "role": args.role},
                )
                print(f"Created user (raw SQL) email={args.email} role={args.role}")
                return
    finally:
        db.close()


if __name__ == "__main__":
    main()
