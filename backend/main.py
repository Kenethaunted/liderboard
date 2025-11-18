from fastapi import FastAPI
from routes import leaderboard, auth, profile  # Добавлен profile
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=os.getenv('SECRET_KEY'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(leaderboard.router)
app.include_router(auth.router)
app.include_router(profile.router)  # Добавлен профиль

@app.get("/")
def read_root():
    return {"message": "FastAPI Leaderboard API with OAuth"}