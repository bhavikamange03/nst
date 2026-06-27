import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use SQLite for development; set DATABASE_URL env var for PostgreSQL
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./nst.db")

engine = create_engine(
   DATABASE_URL,
   echo=True,
   connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(
   autoflush=False,
   autocommit=False,
   bind=engine
)


def get_db():
   db = SessionLocal()
   try:
      yield db
   finally:
      db.close()
