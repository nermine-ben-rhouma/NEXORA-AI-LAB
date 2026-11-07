
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
} from "lucide-react";

function WeatherStats({ weather }) {
  const stats = [
    {
      title: "Température",
      value: `${weather.temperature} °C`,
      description: "Température actuelle",
      icon: Thermometer,
    },
    {
      title: "Humidité",
      value: `${weather.humidity}%`,
      description: "Humidité relative",
      icon: Droplets,
    },
    {
      title: "Vent",
      value: `${weather.wind_speed} km/h`,
      description: "Vitesse du vent",
      icon: Wind,
    },
    {
      title: "Pression",
      value: `${weather.pressure} hPa`,
      description: "Pression atmosphérique",
      icon: Gauge,
    },
  ];

  return (
    <section className="mt-8">
      <h3 className="mb-5 text-xl font-bold">
        Statistiques météo
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-white/10 bg-[#111a2c] p-5 transition hover:border-blue-500/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {stat.title}
                </span>

                <div className="rounded-xl bg-blue-500/10 p-3">
                  <Icon size={22} className="text-blue-400" />
                </div>
              </div>

              <p className="text-2xl font-bold">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherStats;
