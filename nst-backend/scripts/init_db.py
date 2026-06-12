#!/usr/bin/env python3
"""Create database tables from SQLAlchemy models.

Usage:
  # use existing DATABASE_URL or set one
  export DATABASE_URL="sqlite:///./nst.db"
  python scripts/init_db.py
"""
import sys
import pkgutil
import importlib
from pathlib import Path

# Ensure project root is importable
PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app.database.base import Base
from app.database import session as db_session


def import_models():
    try:
        import app.models as models_pkg
    except Exception as e:
        print("Failed to import app.models package:", e)
        return

    for finder, name, ispkg in pkgutil.iter_modules(models_pkg.__path__):
        try:
            importlib.import_module(f"app.models.{name}")
            print(f"Imported model module: app.models.{name}")
        except Exception as e:
            print(f"Warning: failed to import app.models.{name}: {e}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Initialize database tables from models")
    parser.add_argument("--drop", action="store_true", help="Drop all tables before creating them")
    parser.add_argument("--yes", action="store_true", help="Answer yes to confirmation prompt")
    args = parser.parse_args()

    print("DATABASE_URL:", getattr(db_session, 'DATABASE_URL', 'unknown'))

    import_models()

    engine = getattr(db_session, 'engine', None)
    if engine is None:
        print("No engine available in app.database.session. Cannot create tables.")
        sys.exit(1)

    try:
        if args.drop:
            if not args.yes:
                confirm = input("This will DROP ALL TABLES in the database. Type YES to continue: ")
                if confirm.strip() != "YES":
                    print("Aborted.")
                    return
            print("Dropping all tables...")
            Base.metadata.drop_all(bind=engine)
            print("All tables dropped.")

        print("Creating tables from models...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created (or already exist).")
    except Exception as e:
        print("Failed to create/drop tables:", e)
        raise


if __name__ == '__main__':
    main()
