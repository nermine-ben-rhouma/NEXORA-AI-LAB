
import { useEffect, useState } from "react";
import { getHistory } from "../services/sentimentService";
import { History as HistoryIcon, RefreshCw, Search } from "lucide-react";

function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger l'historique.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  const getSentimentColor = (sentiment) => {
    if (sentiment === "positif") return "text-emerald-400 bg-emerald-500/10";
    if (sentiment === "négatif") return "text-rose-400 bg-rose-500/10";
    return "text-amber-400 bg-amber-500/10";
  };

  return (
    <div className="min-h-screen bg-[#080b16] p-8 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <HistoryIcon size={30} className="text-violet-400" />
          <h1 className="text-3xl font-bold">Historique des analyses</h1>
        </div>
        <p className="mt-2 text-slate-400">
          Consultez et recherchez toutes vos analyses précédentes.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un texte..."
            className="w-full rounded-xl border border-white/10 bg-[#111729] py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500"
          />
        </div>

        <button
          onClick={loadHistory}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-medium hover:bg-violet-500 disabled:opacity-50"
        >
          <RefreshCw size={18} />
          Actualiser
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">
        <div className="mb-5 flex justify-between">
          <h2 className="text-lg font-semibold">Toutes les analyses</h2>
          <span className="text-sm text-slate-400">
            {filteredHistory.length} résultat(s)
          </span>
        </div>

        {error && <p className="py-4 text-rose-400">{error}</p>}

        {loading ? (
          <p className="py-10 text-center text-slate-400">Chargement...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="py-10 text-center text-slate-400">
            Aucune analyse trouvée.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Texte</th>
                  <th className="px-4 py-4">Sentiment</th>
                  <th className="px-4 py-4">Confiance</th>
                  <th className="px-4 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="px-4 py-4 text-slate-400">{item.id}</td>
                    <td className="max-w-xs px-4 py-4 text-slate-300">
                      <span className="line-clamp-2">{item.text}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getSentimentColor(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="px-4 py-4">{item.confidence}%</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-400">
                      {new Date(item.created_at).toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
