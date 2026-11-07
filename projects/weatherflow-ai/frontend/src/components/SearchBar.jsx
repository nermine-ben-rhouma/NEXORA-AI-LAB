import { useState } from "react";
import { Search, MapPin } from "lucide-react";

function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2"
    >
      <MapPin className="ml-3 text-blue-400" size={20} />

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Rechercher une ville..."
        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-white placeholder-gray-500"
      />

      <button
        type="submit"
        disabled={loading || !city.trim()}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Search size={18} />
        Rechercher
      </button>
    </form>
  );
}

export default SearchBar;