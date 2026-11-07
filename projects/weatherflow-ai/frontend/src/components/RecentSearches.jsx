
import { Clock, MapPin, ArrowRight } from "lucide-react";

function RecentSearches({ cities, onSelect }) {
  if (!cities.length) return null;

  return (
    <div id="history" className="mt-8">
      <div className="mb-5 flex items-center gap-2">
        <Clock size={20} className="text-blue-400" />

        <h3 className="text-lg font-bold">
          Recherches récentes
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#111a2c] p-4 text-left transition hover:border-blue-500/40 hover:bg-blue-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <MapPin size={20} className="text-blue-400" />
              </div>

              <span className="font-medium">{city}</span>
            </div>

            <ArrowRight
              size={18}
              className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-blue-400"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentSearches;
