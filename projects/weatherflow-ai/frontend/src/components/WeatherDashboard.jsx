
import { useEffect, useState } from "react";

import {
  Activity,
  Clock,
  CloudSun,
  AlertCircle,
} from "lucide-react";

import WeatherCard from "./WeatherCard";
import WeatherStats from "./WeatherStats";
import WeatherMap from "./WeatherMap";
import ForecastCard from "./ForecastCard";
import TemperatureChart from "./TemperatureChart";

import { getWeatherForecast } from "../services/weatherService";

function WeatherDashboard({ weather }) {
  const [forecast, setForecast] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(true);
  const [forecastError, setForecastError] = useState("");

  const currentTime = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const loadForecast = async () => {
      setForecastLoading(true);
      setForecastError("");

      try {
        const data = await getWeatherForecast(weather.city);

        setForecast(data.forecast || []);
      } catch (error) {
        setForecastError(
          "Impossible de charger les prévisions météorologiques."
        );

        setForecast([]);
      } finally {
        setForecastLoading(false);
      }
    };

    loadForecast();
  }, [weather.city]);

  return (
  <div id="dashboard" className="space-y-7">
      {/* Dashboard heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            WEATHER OVERVIEW
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Conditions météorologiques
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Voici les dernières données disponibles pour {weather.city}.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <Activity size={18} />
          Données actualisées
        </div>
      </div>

      {/* Update information */}
      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-400" />
          Heure locale : {currentTime}
        </div>

        <div className="flex items-center gap-2">
          <CloudSun size={17} className="text-blue-400" />
          Données météorologiques Open-Meteo
        </div>
      </div>

      {/* Current weather */}
      <WeatherCard weather={weather} />

      {/* Interactive map */}
      <WeatherMap weather={weather} />

      {/* Weather statistics */}
      <WeatherStats weather={weather} />

      {/* Forecast loading */}
      {forecastLoading && (
        <div className="py-8 text-center text-gray-400">
          Chargement des prévisions météo...
        </div>
      )}

      {/* Forecast error */}
      {forecastError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />
          <p>{forecastError}</p>
        </div>
      )}

      {/* Temperature chart and forecast */}
      {!forecastLoading && forecast.length > 0 && (
        <>
          <TemperatureChart forecast={forecast} />

          <ForecastCard forecast={forecast} />
        </>
      )}

    </div>
  );
}

export default WeatherDashboard;
