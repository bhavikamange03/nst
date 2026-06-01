from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:postgres@localhost/nst"

engine = create_engine(
   DATABASE_URL,
   echo=True
)

SessionLocal = sessionmaker(
   autoflush=False,
   autocommit=False,
   bind=engine
)
