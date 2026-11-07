
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
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

function WeatherCard({ weather }) {
  const WeatherIcon = getWeatherIcon(Number(weather.icon));

  const details = [
    {
      icon: Thermometer,
      label: "Température ressentie",
      value: `${weather.feels_like} °C`,
    },
    {
      icon: Droplets,
      label: "Humidité",
      value: `${weather.humidity}%`,
    },
    {
      icon: Wind,
      label: "Vitesse du vent",
      value: `${weather.wind_speed} km/h`,
    },
    {
      icon: Gauge,
      label: "Pression atmosphérique",
      value: `${weather.pressure} hPa`,
    },
  ];

  return (
    <div id="current-weather" className="space-y-6">

      {/* Main weather card */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#172d59] via-[#142448] to-[#101a35] p-8 shadow-2xl shadow-blue-950/30">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">

          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Conditions actuelles
            </div>

            <h2 className="text-3xl font-bold">
              {weather.city}, {weather.country}
            </h2>

            <p className="mt-3 text-lg text-blue-200">
              {weather.description}
            </p>

            <div className="mt-6 flex items-start">
              <span className="text-8xl font-bold tracking-tighter">
                {Math.round(weather.temperature)}
              </span>

              <span className="mt-3 text-4xl font-light text-blue-300">
                °C
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="rounded-full border border-white/10 bg-white/5 p-8 shadow-lg">
              <WeatherIcon
                size={100}
                strokeWidth={1.2}
                className="text-blue-300"
              />
            </div>

            <p className="mt-4 text-sm text-blue-200">
              {weather.description}
            </p>
          </div>

        </div>
      </div>

      {/* Weather details */}
      <div>
        <h3 className="mb-5 text-xl font-bold">
          Détails météorologiques
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-[#111a2c] p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="rounded-xl bg-blue-500/10 p-3">
                    <Icon size={23} className="text-blue-400" />
                  </div>

                  <span className="text-xs text-gray-500">
                    LIVE
                  </span>
                </div>

                <p className="text-sm text-gray-400">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {item.value}
                </p>
              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}

export default WeatherCard;
