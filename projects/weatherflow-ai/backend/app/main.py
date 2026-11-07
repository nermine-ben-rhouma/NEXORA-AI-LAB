from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.services.weather_service import get_current_weather
from app.services.weather_service import (
    get_current_weather,
    get_weather_forecast
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="API intelligente de prévisions météorologiques"
)


# Configuration CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5178",
        "http://127.0.0.1:5178",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Bienvenue sur WEATHERFLOW AI API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/api/v1/weather/current")
async def current_weather(
    city: str = Query(..., min_length=2)
):
    try:
        weather = await get_current_weather(city)
        return weather

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Impossible de récupérer les données météo."
        )


@app.get("/api/v1/weather/forecast")
async def weather_forecast(
    city: str = Query(..., min_length=2)
):
    try:
        forecast = await get_weather_forecast(city)
        return forecast

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Impossible de récupérer les prévisions météo."
        )
