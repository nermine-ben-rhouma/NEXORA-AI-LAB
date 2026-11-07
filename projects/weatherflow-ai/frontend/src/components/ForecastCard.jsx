
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  CalendarDays,
  Droplets,
} from "lucide-react";

function getWeatherIcon(code) {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return CloudRain;

  if ([71, 73, 75].includes(code)) return CloudSnow;
  if ([95, 96, 99].includes(code)) return CloudLightning;

  return Cloud;
}

function ForecastCard({ forecast }) {
  const formatDate = (date) => {
    return new Date(date + "T12:00:00").toLocaleDateString(
      "fr-FR",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
  };

  return (
    <section id="forecast" className="mt-8">
      <div className="mb-5 flex items-center gap-3">
        <CalendarDays className="text-blue-400" size={23} />

        <div>
          <h3 className="text-xl font-bold">
            Prévisions sur 7 jours
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Évolution des conditions météorologiques
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {forecast.map((day) => {
          const WeatherIcon = getWeatherIcon(
            Number(day.weather_code)
          );

          return (
            <div
              key={day.date}
              className="rounded-2xl border border-white/10 bg-[#111a2c] p-5 transition hover:-translate-y-1 hover:border-blue-500/40"
            >
              <p className="font-semibold capitalize">
                {formatDate(day.date)}
              </p>

              <div className="my-5 flex items-center justify-between">
                <WeatherIcon
                  size={42}
                  className="text-blue-400"
                />

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {Math.round(day.temperature_max)}°
                  </p>

                  <p className="text-sm text-gray-400">
                    {Math.round(day.temperature_min)}° min
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-300">
                {day.description}
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-blue-300">
                <Droplets size={17} />

                <span>
                  Pluie : {day.precipitation_probability ?? "N/A"}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ForecastCard;
