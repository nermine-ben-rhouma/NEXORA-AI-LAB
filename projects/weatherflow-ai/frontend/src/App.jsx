
import { useState, useEffect } from "react";
import {
  Bell,
  CloudSun,
  AlertCircle,
  Star,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import WeatherDashboard from "./components/WeatherDashboard";
import Loading from "./components/Loading";
import RecentSearches from "./components/RecentSearches";
import FavoriteCities from "./components/FavoriteCities";

import { getCurrentWeather } from "./services/weatherService";

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const handleNavigate = (sectionId) => {
  setActiveSection(sectionId);

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  // Historique des recherches
  const [recentCities, setRecentCities] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("weatherRecentCities")
      ) || [];
    } catch {
      return [];
    }
  });

  // Villes favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("weatherFavoriteCities")
      ) || [];
    } catch {
      return [];
    }
  });

  // Sauvegarder l'historique
  useEffect(() => {
    localStorage.setItem(
      "weatherRecentCities",
      JSON.stringify(recentCities)
    );
  }, [recentCities]);

  // Sauvegarder les favoris
  useEffect(() => {
    localStorage.setItem(
      "weatherFavoriteCities",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Rechercher la météo
  const handleSearch = async (city) => {
    setLoading(true);
    setError("");

    try {
      const data = await getCurrentWeather(city);

      setWeather(data);

      setRecentCities((previous) => [
        data.city,
        ...previous.filter(
          (item) =>
            item.toLowerCase() !== data.city.toLowerCase()
        ),
      ].slice(0, 5));

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Impossible de récupérer les données météo."
      );

      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une ville favorite
  const addFavorite = (city) => {
    if (!city) return;

    setFavorites((previous) => {
      const exists = previous.some(
        (item) => item.toLowerCase() === city.toLowerCase()
      );

      if (exists) return previous;

      return [...previous, city];
    });
  };

  // Supprimer une ville favorite
  const removeFavorite = (city) => {
    setFavorites((previous) =>
      previous.filter(
        (item) => item.toLowerCase() !== city.toLowerCase()
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-[#080d1a] text-white">

      {/* Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0">
       <Sidebar
        onNavigate={handleNavigate}
        activeSection={activeSection}
          />
      </div>

      {/* Main content */}
      <main className="min-w-0 flex-1 px-5 py-7 md:px-8 lg:px-10">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Bienvenue sur votre espace
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Weather Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-yellow-400">
              <Star size={20} />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <CloudSun size={20} />
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  WEATHERFLOW AI
                </p>

                <p className="text-xs text-gray-400">
                  Smart Weather
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold md:text-4xl">
            Explorez la météo
            <span className="text-blue-400">
              {" "}intelligemment.
            </span>
          </h2>

          <p className="mt-3 text-gray-400">
            Consultez les conditions météorologiques de votre ville.
          </p>
        </section>

        {/* Search */}
        <div className="mb-8 max-w-3xl">
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Weather content */}
        {loading && <Loading />}

        {!loading && weather && (
          <>
            <WeatherDashboard weather={weather} />

            <FavoriteCities
              favorites={favorites}
              currentCity={weather.city}
              onAdd={addFavorite}
              onSelect={handleSearch}
              onRemove={removeFavorite}
            />
          </>
        )}

        {!loading && !weather && !error && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-900/10 text-center">
            <CloudSun
              size={85}
              className="mb-5 text-blue-400"
            />

            <h3 className="text-2xl font-bold">
              Découvrez la météo
            </h3>

            <p className="mt-3 max-w-md px-5 text-sm text-gray-400">
              Recherchez une ville pour découvrir sa température,
              son humidité, son vent et ses conditions météorologiques.
            </p>
          </div>
        )}

        {/* Recent searches */}
        <RecentSearches
          cities={recentCities}
          onSelect={handleSearch}
        />

        {/* Footer */}
<footer id="about" className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-500">      
    © 2026 WEATHERFLOW AI — Powered by Open-Meteo
        </footer>

      </main>
    </div>
  );
}

export default App;
