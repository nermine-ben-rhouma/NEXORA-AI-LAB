
import { useEffect, useState } from "react";
import {
  analyzeSentiment,
  getHistory,
} from "../services/sentimentService";

import {
  Activity,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Minus,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Clock,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger l'historique
  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Erreur historique :", err);
      setError("Impossible de charger l'historique.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Analyser un texte
  const handleAnalyze = async () => {
    if (text.trim().length < 2) {
      setError("Veuillez saisir au moins 2 caractères.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await analyzeSentiment(text);

      setResult(data);
      setText("");

      await loadHistory();
    } catch (err) {
      console.error("Erreur analyse :", err);
      setError(
        err.response?.data?.detail ||
        "Une erreur est survenue pendant l'analyse."
      );
    } finally {
      setLoading(false);
    }
  };

  // Calcul des statistiques
  const total = history.length;

  const positive = history.filter(
    (item) => item.sentiment === "positif"
  ).length;

  const negative = history.filter(
    (item) => item.sentiment === "négatif"
  ).length;

  const neutral = history.filter(
    (item) => item.sentiment === "neutre"
  ).length;

  // Données du graphique circulaire
  const chartData = [
    { name: "Positif", value: positive, color: "#10b981" },
    { name: "Négatif", value: negative, color: "#f43f5e" },
    { name: "Neutre", value: neutral, color: "#f59e0b" },
  ];

  // Données du graphique en barres
  const barData = [
    { name: "Positifs", analyses: positive },
    { name: "Négatifs", analyses: negative },
    { name: "Neutres", analyses: neutral },
  ];

  // Couleur selon le sentiment
  const sentimentStyle = (sentiment) => {
    if (sentiment === "positif") {
      return "bg-emerald-500/10 text-emerald-400";
    }

    if (sentiment === "négatif") {
      return "bg-rose-500/10 text-rose-400";
    }

    return "bg-amber-500/10 text-amber-400";
  };

  // Formatage de la date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("fr-FR");
  };

  return (
    <div className="min-h-screen bg-[#080b16] text-white">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="rounded-xl bg-violet-600 p-3">
            <Activity size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">NEXORA AI</h1>
            <p className="text-sm text-slate-400">
              Sentiment Analysis Platform
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8">

        {/* Titre */}
        <section>
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Analysez les sentiments et consultez vos statistiques.
          </p>
        </section>

        {/* Statistiques */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              label: "Total analyses",
              value: total,
              icon: BarChart3,
            },
            {
              label: "Positifs",
              value: positive,
              icon: ThumbsUp,
            },
            {
              label: "Négatifs",
              value: negative,
              icon: ThumbsDown,
            },
            {
              label: "Neutres",
              value: neutral,
              icon: Minus,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#111729] p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {stat.label}
                  </p>

                  <Icon
                    className="text-violet-400"
                    size={21}
                  />
                </div>

                <p className="mt-4 text-3xl font-bold">
                  {stat.value}
                </p>
              </div>
            );
          })}

        </section>

        {/* Graphiques statistiques */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Graphique circulaire */}
          <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">

            <h3 className="text-lg font-semibold">
              Répartition des sentiments
            </h3>

            <p className="mb-4 mt-2 text-sm text-slate-400">
              Distribution des résultats d'analyse.
            </p>

            <div className="h-72">
              {total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111729",
                        border: "1px solid #334155",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  Aucune donnée disponible.
                </div>
              )}
            </div>
          </div>

          {/* Graphique en barres */}
          <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">

            <h3 className="text-lg font-semibold">
              Nombre d'analyses par sentiment
            </h3>

            <p className="mb-4 mt-2 text-sm text-slate-400">
              Comparaison des catégories de sentiments.
            </p>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#273047"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                  />

                  <YAxis
                    allowDecimals={false}
                    stroke="#94a3b8"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111729",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="analyses"
                    name="Analyses"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>

        {/* Zone d'analyse */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Formulaire */}
          <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-lg bg-violet-500/10 p-2">
                <Sparkles className="text-violet-400" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Nouvelle analyse
                </h3>

                <p className="text-sm text-slate-400">
                  Saisissez un texte à analyser.
                </p>
              </div>

            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Écrivez votre texte ici..."
              className="min-h-40 w-full resize-y rounded-xl border border-white/10 bg-[#080b16] p-4 text-sm outline-none focus:border-violet-500"
            />

            {error && (
              <p className="mt-3 text-sm text-rose-400">
                {error}
              </p>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />

              {loading
                ? "Analyse en cours..."
                : "Analyser le sentiment"}
            </button>

          </div>

          {/* Résultat */}
          <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-lg bg-blue-500/10 p-2">
                <MessageSquare className="text-blue-400" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Résultat de l'analyse
                </h3>

                <p className="text-sm text-slate-400">
                  Le dernier résultat obtenu.
                </p>
              </div>

            </div>

            {result ? (
              <div className="space-y-5">

                <div>
                  <p className="text-sm text-slate-400">
                    Sentiment détecté
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-4 py-2 font-semibold ${sentimentStyle(result.sentiment)}`}
                  >
                    {result.sentiment}
                  </span>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">
                      Confiance
                    </span>

                    <span className="font-semibold">
                      {result.confidence}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-slate-400">
                    Explication
                  </p>

                  <p className="rounded-xl bg-[#080b16] p-4 text-sm leading-6 text-slate-300">
                    {result.explanation}
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center text-center text-slate-500">

                <Sparkles
                  size={35}
                  className="mb-3 text-violet-400"
                />

                <p>
                  Le résultat apparaîtra ici après votre analyse.
                </p>

              </div>
            )}

          </div>

        </section>

        {/* Historique récent */}
        <section className="rounded-2xl border border-white/10 bg-[#111729] p-6">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

            <div>
              <h3 className="text-xl font-semibold">
                Historique des analyses
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Retrouvez les textes analysés précédemment.
              </p>
            </div>

            <button
              onClick={loadHistory}
              disabled={historyLoading}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Actualiser
            </button>

          </div>

          {historyLoading ? (
            <p className="py-8 text-center text-slate-400">
              Chargement de l'historique...
            </p>
          ) : history.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              Aucune analyse enregistrée pour le moment.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px] text-left text-sm">

                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="px-4 py-3">Texte</th>
                    <th className="px-4 py-3">Sentiment</th>
                    <th className="px-4 py-3">Confiance</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="max-w-xs px-4 py-4 text-slate-300">
                        <span className="line-clamp-2">
                          {item.text}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${sentimentStyle(item.sentiment)}`}
                        >
                          {item.sentiment}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        {item.confidence}%
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-400">
                        <span className="flex items-center gap-2">
                          <Clock size={14} />
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
