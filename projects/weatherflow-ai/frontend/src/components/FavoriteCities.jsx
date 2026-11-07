
import { Star, MapPin, Trash2 } from "lucide-react";

function FavoriteCities({
  favorites,
  currentCity,
  onAdd,
  onSelect,
  onRemove,
}) {
  const isFavorite = favorites.some(
    (city) => city.toLowerCase() === currentCity.toLowerCase()
  );

  return (
    <section id="favorites" className="mt-8 rounded-3xl border border-white/10 bg-[#111a2c] p-6">

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Star className="text-yellow-400" size={22} />
            Mes villes favorites
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Accédez rapidement à vos villes préférées.
          </p>
        </div>

        <button
          onClick={() => onAdd(currentCity)}
          disabled={!currentCity || isFavorite}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="flex items-center gap-2">
            <Star size={17} />
            {isFavorite ? "Déjà ajouté" : "Ajouter aux favoris"}
          </span>
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
          Aucune ville favorite pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((city) => (
            <div
              key={city}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1220] p-4"
            >
              <button
                onClick={() => onSelect(city)}
                className="flex min-w-0 items-center gap-3 text-left"
              >
                <MapPin className="shrink-0 text-blue-400" size={20} />

                <span className="truncate font-medium">
                  {city}
                </span>
              </button>

              <button
                onClick={() => onRemove(city)}
                title="Supprimer des favoris"
                className="ml-3 rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}

export default FavoriteCities;
