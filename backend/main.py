import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import detect, languages, translate

app = FastAPI(
    title="LinguaAI API",
    description="Real-time translation API powered by LibreTranslate",
    version="1.0.0",
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(
    ","
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate.router, tags=["translate"])
app.include_router(detect.router, tags=["detect"])
app.include_router(languages.router, tags=["languages"])


@app.get("/")
async def root():
    return {"message": "LinguaAI API", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
