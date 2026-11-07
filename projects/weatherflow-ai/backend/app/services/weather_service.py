
import httpx


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


def get_weather_description(code):
    descriptions = {
        0: "Ciel dégagé",
        1: "Principalement dégagé",
        2: "Partiellement nuageux",
        3: "Couvert",
        45: "Brouillard",
        48: "Brouillard givrant",
        51: "Bruine légère",
        53: "Bruine modérée",
        55: "Bruine dense",
        61: "Pluie légère",
        63: "Pluie modérée",
        65: "Pluie forte",
        71: "Neige légère",
        73: "Neige modérée",
        75: "Neige forte",
        80: "Averses légères",
        81: "Averses modérées",
        82: "Averses violentes",
        95: "Orage",
        96: "Orage avec grêle",
        99: "Orage violent avec grêle"
    }

    return descriptions.get(
        code,
        "Conditions météorologiques inconnues"
    )


async def get_current_weather(city: str):

    async with httpx.AsyncClient(timeout=20.0) as client:

        # 1. Rechercher les coordonnées de la ville
        geo_response = await client.get(
            GEOCODING_URL,
            params={
                "name": city,
                "count": 1,
                "language": "fr",
                "format": "json"
            }
        )

        geo_response.raise_for_status()
        geo_data = geo_response.json()

        if not geo_data.get("results"):
            raise ValueError("Ville introuvable.")

        location = geo_data["results"][0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        # 2. Récupérer la météo actuelle
        weather_response = await client.get(
            WEATHER_URL,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": (
                    "temperature_2m,"
                    "relative_humidity_2m,"
                    "apparent_temperature,"
                    "weather_code,"
                    "wind_speed_10m,"
                    "surface_pressure"
                ),
                "timezone": "auto"
            }
        )

        weather_response.raise_for_status()
        weather_data = weather_response.json()

    current = weather_data["current"]

    return {
        "city": location["name"],
        "country": location.get("country_code", ""),

        # Coordonnées géographiques
        "latitude": latitude,
        "longitude": longitude,

        # Données météorologiques
        "temperature": current["temperature_2m"],
        "feels_like": current["apparent_temperature"],
        "humidity": current["relative_humidity_2m"],
        "pressure": current["surface_pressure"],
        "description": get_weather_description(
            current["weather_code"]
        ),
        "icon": str(current["weather_code"]),
        "wind_speed": current["wind_speed_10m"]
    }


async def get_weather_forecast(city: str):

    async with httpx.AsyncClient(timeout=20.0) as client:

        # 1. Rechercher les coordonnées de la ville
        geo_response = await client.get(
            GEOCODING_URL,
            params={
                "name": city,
                "count": 1,
                "language": "fr",
                "format": "json"
            }
        )

        geo_response.raise_for_status()
        geo_data = geo_response.json()

        if not geo_data.get("results"):
            raise ValueError("Ville introuvable.")

        location = geo_data["results"][0]

        # 2. Récupérer les prévisions sur 7 jours
        forecast_response = await client.get(
            WEATHER_URL,
            params={
                "latitude": location["latitude"],
                "longitude": location["longitude"],
                "daily": (
                    "weather_code,"
                    "temperature_2m_max,"
                    "temperature_2m_min,"
                    "precipitation_probability_max"
                ),
                "forecast_days": 7,
                "timezone": "auto"
            }
        )

        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()

    daily = forecast_data["daily"]

    forecast = []

    for i in range(len(daily["time"])):
        forecast.append({
            "date": daily["time"][i],
            "weather_code": daily["weather_code"][i],
            "description": get_weather_description(
                daily["weather_code"][i]
            ),
            "temperature_max": daily["temperature_2m_max"][i],
            "temperature_min": daily["temperature_2m_min"][i],
            "precipitation_probability": (
                daily["precipitation_probability_max"][i]
            )
        })

    return {
        "city": location["name"],
        "country": location.get("country_code", ""),
        "latitude": location["latitude"],
        "longitude": location["longitude"],
        "forecast": forecast
    }
