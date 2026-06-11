from fastapi import FastAPI
from app.routers import auth
from app.routers import admin

app = FastAPI()

app.include_router(auth.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "NST API Running"}
