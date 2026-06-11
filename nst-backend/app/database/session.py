import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost/nst")

engine = create_engine(
   DATABASE_URL,
   echo=True
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
