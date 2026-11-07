
import {
  CloudSun,
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Star,
  History,
  Info,
  Sparkles,
} from "lucide-react";

function Sidebar({ onNavigate, activeSection = "dashboard" }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "current-weather",
      label: "Météo actuelle",
      icon: CloudSun,
    },
    {
      id: "forecast",
      label: "Prévisions sur 7 jours",
      icon: CalendarDays,
    },
    {
      id: "weather-map",
      label: "Carte météorologique",
      icon: MapPin,
    },
    {
      id: "favorites",
      label: "Villes favorites",
      icon: Star,
    },
    {
      id: "history",
      label: "Historique",
      icon: History,
    },
    {
      id: "about",
      label: "À propos",
      icon: Info,
    },
  ];

  return (
    <aside className="flex h-full min-h-screen w-64 flex-col border-r border-white/10 bg-[#0b1220] px-5 py-7">

      {/* Logo */}
      <div className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-blue-600 p-2">
          <CloudSun size={27} />
        </div>

        <div>
          <h1 className="text-lg font-bold">WEATHERFLOW</h1>
          <p className="text-xs tracking-widest text-blue-400">
            ARTIFICIAL INTELLIGENCE
          </p>
        </div>
      </div>

      {/* Navigation */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Menu principal
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                active
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom card */}
      <div className="mt-auto rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
        <Sparkles size={22} className="mb-3 text-blue-400" />

        <h3 className="text-sm font-semibold">
          WeatherFlow AI
        </h3>

        <p className="mt-2 text-xs leading-5 text-gray-400">
          Une expérience intelligente pour suivre les conditions météorologiques.
        </p>

        <p className="mt-4 text-xs text-blue-400">
          Version 1.0.0
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;
