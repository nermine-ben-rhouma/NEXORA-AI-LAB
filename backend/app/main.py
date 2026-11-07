
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.translation import router as translation_router

from app.database.connection import initialize_database


logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Professional AI-powered multilingual "
        "translation platform using LangChain and Groq."
    )
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    initialize_database()


@app.get("/", tags=["General"])
async def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "LINGUA AI backend is running."
    }


@app.get("/health", tags=["General"])
async def health():
    return {
        "status": "healthy",
        "application": settings.APP_NAME
    }


# Routes de traduction uniquement
app.include_router(translation_router)
