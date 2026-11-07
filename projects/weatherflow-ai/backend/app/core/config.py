import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")


class Settings:
    APP_NAME = os.getenv("APP_NAME", "WEATHERFLOW AI")
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")

    WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

    WEATHER_API_URL = os.getenv(
        "WEATHER_API_URL",
        "https://api.openweathermap.org/data/2.5"
    )


settings = Settings()