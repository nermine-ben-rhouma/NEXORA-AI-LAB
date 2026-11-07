import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")


class Settings:
    APP_NAME = os.getenv("APP_NAME", "DOCUVISION")
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./docuvision.db"
    )

    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE = int(
        os.getenv("MAX_FILE_SIZE", 10485760)
    )


settings = Settings()