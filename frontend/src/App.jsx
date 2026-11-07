
import { useCallback, useEffect, useState } from "react";

import {
  Languages,
  LayoutDashboard,
  History,
  ArrowLeftRight,
  Copy,
  Trash2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Globe2,
  Activity,
  Check,
  Loader2,
  Menu,
  X,
  FileText,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

import {
  translateText,
  getTranslationHistory,
  deleteTranslation,
  getTranslationStatistics,
} from "./services/translationService";


// ==========================================
// LANGUAGES
// ==========================================

const languages = [
  "English",
  "French",
  "Arabic",
  "Spanish",
  "German",
  "Italian",
  "Portuguese",
  "Turkish",
  "Chinese",
  "Japanese",
];


// ==========================================
// TRANSLATION TONES
// ==========================================

const tones = [
  { value: "natural", label: "Natural" },
  { value: "professional", label: "Professional" },
  { value: "academic", label: "Academic" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
];


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(
    date.endsWith("Z")
      ? date
      : `${date.replace(" ", "T")}Z`
  );

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}


// ==========================================
// STATISTICS CARD
// ==========================================

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#111629] p-5 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <div className="rounded-xl border border-violet-400/10 bg-violet-500/10 p-3 text-violet-400 transition group-hover:bg-violet-500/20">
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-5 break-words text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}


// ==========================================
// MAIN DASHBOARD
// ==========================================

function Dashboard() {

  // Navigation
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Translator
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const [sourceLanguage, setSourceLanguage] =
    useState("Auto-detect");

  const [targetLanguage, setTargetLanguage] =
    useState("French");

  const [tone, setTone] = useState("natural");

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] =
    useState(true);

  const [deletingId, setDeletingId] = useState(null);

  // Statistics
  const [statistics, setStatistics] = useState({
    total_translations: 0,
    languages: [],
    tones: [],
    recent_activity: [],
  });

  const [statsLoading, setStatsLoading] =
    useState(true);

  // General error
  const [error, setError] = useState("");


  // ========================================
  // LOAD HISTORY
  // ========================================

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);

    try {
      const data = await getTranslationHistory();

      setHistory(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("History loading error:", err);

      setError(
        "Impossible de charger l'historique des traductions."
      );

    } finally {
      setHistoryLoading(false);
    }
  }, []);


  // ========================================
  // LOAD STATISTICS
  // ========================================

  const loadStatistics = useCallback(async () => {
    setStatsLoading(true);

    try {
      const data = await getTranslationStatistics();

      setStatistics({
        total_translations:
          data.total_translations ?? 0,

        languages: data.languages || [],

        tones: data.tones || [],

        recent_activity:
          data.recent_activity || [],
      });

    } catch (err) {
      console.error("Statistics loading error:", err);

      setError(
        "Impossible de charger les statistiques."
      );

    } finally {
      setStatsLoading(false);
    }
  }, []);


  // ========================================
  // REFRESH ALL DATA
  // ========================================

  const refreshData = useCallback(async () => {
    await Promise.all([
      loadHistory(),
      loadStatistics(),
    ]);
  }, [loadHistory, loadStatistics]);


  // Charger les données au démarrage
  useEffect(() => {
    refreshData();
  }, [refreshData]);


  // ========================================
  // TRANSLATE TEXT
  // ========================================

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Veuillez saisir un texte à traduire.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const data = await translateText({
        text: text.trim(),
        source_language: sourceLanguage,
        target_language: targetLanguage,
        tone,
      });

      setResult(data.translated_text);

      await refreshData();

    } catch (err) {
      console.error("Translation error:", err);

      setError(
        err.response?.data?.detail ||
        "Une erreur est survenue pendant la traduction."
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================
  // COPY TRANSLATION
  // ========================================

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);

    } catch {
      setError("Impossible de copier le texte.");
    }
  };


  // ========================================
  // SWAP LANGUAGES
  // ========================================

  const handleSwap = () => {
    if (sourceLanguage === "Auto-detect") {
      return;
    }

    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);

    setText(result || text);
    setResult("");
  };


  // ========================================
  // RESET TRANSLATOR
  // ========================================

  const handleReset = () => {
    setText("");
    setResult("");
    setError("");
    setCopied(false);
  };


  // ========================================
  // DELETE TRANSLATION
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette traduction ?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      await deleteTranslation(id);

      await refreshData();

    } catch (err) {
      console.error("Delete error:", err);

      setError(
        "Impossible de supprimer cette traduction."
      );

    } finally {
      setDeletingId(null);
    }
  };


  // ========================================
  // USE HISTORY
  // ========================================

  const handleUseHistory = (item) => {
    setText(item.original_text);

    setResult(item.translated_text);

    setSourceLanguage(item.source_language);

    setTargetLanguage(item.target_language);

    setTone(item.tone);

    navigatePage("translator");
  };


  // ========================================
  // STATISTICS DATA
  // ========================================

  const languageCount =
    statistics.languages?.length || 0;

  const mostUsedLanguage =
    statistics.languages?.[0]?.target_language || "—";

  const chartData = (
    statistics.recent_activity || []
  ).map((item) => ({
    date: item.date,
    translations: item.count,
  }));

  const languageChartData = (
    statistics.languages || []
  )
    .slice(0, 6)
    .map((item) => ({
      language: item.target_language,
      translations: item.count,
    }));


  // ========================================
  // SIDEBAR MENU
  // ========================================

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "translator",
      label: "Translator",
      icon: Languages,
    },
    {
      id: "history",
      label: "Translation History",
      icon: History,
    },
  ];


  // ========================================
  // NAVIGATION
  // ========================================

  function navigatePage(page) {
    setActivePage(page);
    setMobileMenuOpen(false);
    setError("");
  }


  // ========================================
  // SHARED STYLES
  // ========================================

  const cardStyle =
    "rounded-2xl border border-white/[0.08] bg-[#111629] shadow-lg shadow-black/10";

  const headingStyle =
    "font-bold text-white";


  // ========================================
  // APPLICATION UI
  // ========================================

  return (
    <div className="min-h-screen bg-[#080b16] text-slate-100">

      {/* MOBILE OVERLAY */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}


      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.08] bg-[#0d1120] transition-transform duration-300 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-white/[0.08] px-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 p-2.5 text-white shadow-lg shadow-violet-900/30">
              <Languages size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                LINGUA AI
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-violet-400">
                Nexora AI Lab
              </p>
            </div>

          </div>

          <button
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={21} />
          </button>

        </div>


        {/* NAVIGATION */}

        <div className="px-4 py-7">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;

              const active = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => navigatePage(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "border border-violet-400/20 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-950/20"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon size={19} />

                  {item.label}
                </button>
              );
            })}

          </nav>

        </div>


        {/* SIDEBAR FOOTER */}

        <div className="mt-auto p-4">

          <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600/20 to-blue-600/10 p-4">

            <div className="mb-3 flex items-center gap-2 text-violet-300">
              <Sparkles size={17} />

              <span className="text-sm font-semibold">
                Powered by AI
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-300">
              Translate naturally with the power of
              LangChain and Groq.
            </p>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-center text-xs font-medium text-slate-300">
              NEXORA AI LAB
            </div>

          </div>

          <div className="mt-4 border-t border-white/[0.08] pt-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              Intelligent Translation Platform
            </p>
          </div>

        </div>

      </aside>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="min-h-screen lg:ml-64">


        {/* HEADER */}

        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0d1120]/90 px-5 py-3 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-3">

            <button
              className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>

              <h2 className="text-lg font-bold text-white">
                {activePage === "dashboard"
                  ? "Dashboard"
                  : activePage === "translator"
                    ? "AI Translator"
                    : "Translation History"}
              </h2>

              <p className="hidden text-xs text-slate-400 sm:block">
                Welcome to your intelligent translation workspace.
              </p>

            </div>

          </div>


          {/* HEADER ACTIONS */}

          <div className="flex items-center gap-2 sm:gap-3">

            <span className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AI Service
            </span>

            <button
              onClick={refreshData}
              disabled={historyLoading || statsLoading}
              className="flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.03] px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  historyLoading || statsLoading
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">


          {/* ERROR MESSAGE */}

          {error && (
            <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

              <span>{error}</span>

              <button
                onClick={() => setError("")}
                className="text-red-300 hover:text-white"
              >
                <X size={17} />
              </button>

            </div>
          )}


          {/* ==================================
              DASHBOARD PAGE
          ================================== */}

          {activePage === "dashboard" && (

            <>

              {/* HERO */}

              <section className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-r from-[#17112f] via-[#171b45] to-[#102b50] p-7 text-white shadow-2xl shadow-violet-950/20 sm:p-9">

                <div className="relative z-10 max-w-2xl">

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-violet-200">
                    <Sparkles size={14} />
                    Intelligent Translation Platform
                  </div>

                  <h3 className="text-3xl font-bold leading-tight sm:text-4xl">
                    Break language barriers with{" "}

                    <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                      AI.
                    </span>
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    Manage your translations, explore your activity
                    and translate content with an intelligent
                    AI-powered workspace.
                  </p>

                  <button
                    onClick={() => navigatePage("translator")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-900 transition hover:bg-violet-100"
                  >
                    <Languages size={17} />
                    Start translating
                  </button>

                </div>

                <div className="absolute -right-12 -top-24 h-80 w-80 rounded-full border-[35px] border-white/5" />

                <div className="absolute -bottom-36 right-24 h-80 w-80 rounded-full border-[35px] border-violet-300/10" />

                <Globe2
                  size={180}
                  className="absolute bottom-4 right-8 hidden text-white/10 md:block"
                />

              </section>


              {/* PERFORMANCE OVERVIEW */}

              <section>

                <div className="mb-4 flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Performance Overview
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Statistics based on all saved translations.
                    </p>
                  </div>

                  {statsLoading && (
                    <Loader2
                      className="animate-spin text-violet-400"
                      size={19}
                    />
                  )}

                </div>


                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <StatCard
                    title="Total Translations"
                    value={statistics.total_translations}
                    description="All saved translations"
                    icon={FileText}
                  />

                  <StatCard
                    title="Languages Used"
                    value={languageCount}
                    description="Different target languages"
                    icon={Globe2}
                  />

                  <StatCard
                    title="Most Used Language"
                    value={mostUsedLanguage}
                    description="Your top target language"
                    icon={Languages}
                  />

                  <StatCard
                    title="Translation Styles"
                    value={statistics.tones?.length || 0}
                    description="Different tones used"
                    icon={Activity}
                  />

                </div>

              </section>


              {/* CHARTS */}

              <section className="grid gap-5 xl:grid-cols-2">


                {/* ACTIVITY CHART */}

                <div className={`${cardStyle} p-5 sm:p-6`}>

                  <div className="mb-6 flex items-center justify-between">

                    <div>
                      <h3 className={headingStyle}>
                        Translation Activity
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Activity during the last seven days
                      </p>
                    </div>

                    <div className="rounded-xl border border-violet-400/10 bg-violet-500/10 p-2.5 text-violet-400">
                      <TrendingUp size={19} />
                    </div>

                  </div>


                  <div className="h-64">

                    {chartData.length > 0 ? (

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <AreaChart data={chartData}>

                          <defs>
                            <linearGradient
                              id="activityGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.35}
                              />

                              <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#273047"
                          />

                          <XAxis
                            dataKey="date"
                            tick={{
                              fontSize: 11,
                              fill: "#94a3b8",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            allowDecimals={false}
                            tick={{
                              fontSize: 11,
                              fill: "#94a3b8",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#111629",
                              border: "1px solid #303b56",
                              borderRadius: "12px",
                              color: "#f1f5f9",
                            }}
                          />

                          <Area
                            type="monotone"
                            dataKey="translations"
                            stroke="#a78bfa"
                            strokeWidth={3}
                            fill="url(#activityGradient)"
                          />

                        </AreaChart>

                      </ResponsiveContainer>

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        No activity data available yet.
                      </div>

                    )}

                  </div>

                </div>


                {/* LANGUAGE CHART */}

                <div className={`${cardStyle} p-5 sm:p-6`}>

                  <div className="mb-6 flex items-center justify-between">

                    <div>
                      <h3 className={headingStyle}>
                        Popular Languages
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Translations by target language
                      </p>
                    </div>

                    <div className="rounded-xl border border-blue-400/10 bg-blue-500/10 p-2.5 text-blue-400">
                      <Globe2 size={19} />
                    </div>

                  </div>


                  <div className="h-64">

                    {languageChartData.length > 0 ? (

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <BarChart
                          data={languageChartData}
                          layout="vertical"
                          margin={{
                            left: 5,
                            right: 15,
                          }}
                        >

                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="#273047"
                          />

                          <XAxis
                            type="number"
                            allowDecimals={false}
                            tick={{
                              fontSize: 11,
                              fill: "#94a3b8",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <YAxis
                            type="category"
                            dataKey="language"
                            width={75}
                            tick={{
                              fontSize: 11,
                              fill: "#94a3b8",
                            }}
                            axisLine={false}
                            tickLine={false}
                          />

                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#111629",
                              border: "1px solid #303b56",
                              borderRadius: "12px",
                              color: "#f1f5f9",
                            }}
                          />

                          <Bar
                            dataKey="translations"
                            fill="#8b5cf6"
                            radius={[0, 7, 7, 0]}
                            barSize={22}
                          />

                        </BarChart>

                      </ResponsiveContainer>

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        No language data available yet.
                      </div>

                    )}

                  </div>

                </div>

              </section>


              {/* RECENT TRANSLATIONS */}

              <section className={`${cardStyle} p-5 sm:p-6`}>

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <h3 className={headingStyle}>
                      Recent Translations
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Your latest saved translations
                    </p>
                  </div>

                  <button
                    onClick={() => navigatePage("history")}
                    className="text-sm font-semibold text-violet-400 hover:text-violet-300"
                  >
                    View all
                  </button>

                </div>


                {history.slice(0, 5).length > 0 ? (

                  <div className="divide-y divide-white/[0.06]">

                    {history.slice(0, 5).map((item) => (

                      <div
                        key={item.id}
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-slate-200">
                            {item.original_text}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {item.translated_text}
                          </p>

                          <p className="mt-2 text-[11px] text-slate-500">
                            {item.source_language} → {item.target_language}
                            {" · "}
                            {formatDate(item.created_at)}
                          </p>

                        </div>

                        <button
                          onClick={() => handleUseHistory(item)}
                          className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
                        >
                          Open
                        </button>

                      </div>

                    ))}

                  </div>

                ) : (

                  <p className="py-8 text-center text-sm text-slate-500">
                    No translations saved yet.
                  </p>

                )}

              </section>

            </>

          )}


          {/* ==================================
              TRANSLATOR PAGE
          ================================== */}

          {activePage === "translator" && (

            <section className="space-y-6">

              <div>
                <h3 className="text-2xl font-bold text-white">
                  AI Translation Studio
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Translate your text with natural and context-aware AI.
                </p>
              </div>


              <div className={`${cardStyle} p-5 sm:p-7`}>


                {/* LANGUAGE SELECTORS */}

                <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr]">

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      FROM
                    </label>

                    <select
                      value={sourceLanguage}
                      onChange={(e) =>
                        setSourceLanguage(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    >
                      <option>Auto-detect</option>

                      {languages.map((language) => (
                        <option key={language}>
                          {language}
                        </option>
                      ))}

                    </select>
                  </div>


                  <button
                    onClick={handleSwap}
                    disabled={sourceLanguage === "Auto-detect"}
                    className="mx-auto rounded-xl border border-white/10 bg-white/[0.03] p-3 text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Swap languages"
                  >
                    <ArrowLeftRight size={19} />
                  </button>


                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      TO
                    </label>

                    <select
                      value={targetLanguage}
                      onChange={(e) =>
                        setTargetLanguage(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-sm text-slate-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    >
                      {languages.map((language) => (
                        <option key={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>


                {/* TONE SELECTOR */}

                <div className="mt-6">

                  <label className="mb-2 block text-xs font-semibold text-slate-400">
                    TRANSLATION TONE
                  </label>

                  <div className="flex flex-wrap gap-2">

                    {tones.map((item) => (

                      <button
                        key={item.value}
                        onClick={() => setTone(item.value)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          tone === item.value
                            ? "border-violet-500 bg-violet-500/20 text-violet-300"
                            : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-violet-400/30 hover:text-violet-300"
                        }`}
                      >
                        {item.label}
                      </button>

                    ))}

                  </div>

                </div>


                {/* TEXT AREAS */}

                <div className="mt-7 grid gap-5 lg:grid-cols-2">


                  {/* ORIGINAL TEXT */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-sm font-semibold text-slate-200">
                        Original Text
                      </label>

                      <span className="text-xs text-slate-500">
                        {text.length}/5000
                      </span>

                    </div>

                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      maxLength={5000}
                      placeholder="Enter your text here..."
                      className="min-h-64 w-full resize-y rounded-2xl border border-white/10 bg-[#0b1020] p-5 text-sm leading-7 text-slate-200 placeholder:text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    />

                  </div>


                  {/* AI TRANSLATION */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="text-sm font-semibold text-slate-200">
                        AI Translation
                      </label>

                      {result && (
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
                        >
                          {copied
                            ? <Check size={14} />
                            : <Copy size={14} />
                          }

                          {copied ? "Copied" : "Copy"}
                        </button>
                      )}

                    </div>


                    <div className="min-h-64 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[0.08] to-blue-500/[0.05] p-5 text-sm leading-7">

                      {loading ? (

                        <div className="flex h-56 flex-col items-center justify-center gap-3 text-violet-300">

                          <Loader2
                            size={30}
                            className="animate-spin"
                          />

                          <p className="font-medium">
                            AI is translating your text...
                          </p>

                        </div>

                      ) : result ? (

                        <p className="whitespace-pre-wrap text-slate-200">
                          {result}
                        </p>

                      ) : (

                        <div className="flex h-56 flex-col items-center justify-center text-center text-slate-500">

                          <Sparkles
                            size={30}
                            className="mb-3 text-violet-400/60"
                          />

                          <p>
                            Your translation will appear here.
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                </div>


                {/* ACTION BUTTONS */}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">

                  <button
                    onClick={handleReset}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Clear
                  </button>

                  <button
                    onClick={handleTranslate}
                    disabled={loading || !text.trim()}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {loading ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Sparkles size={17} />
                    )}

                    {loading
                      ? "Translating..."
                      : "Translate with AI"
                    }

                  </button>

                </div>

              </div>

            </section>

          )}


          {/* ==================================
              HISTORY PAGE
          ================================== */}

          {activePage === "history" && (

            <section className="space-y-6">

              <div>
                <h3 className="text-2xl font-bold text-white">
                  Translation History
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  View and manage all your saved translations.
                </p>
              </div>


              <div className={`${cardStyle} overflow-hidden`}>

                <div className="flex items-center justify-between border-b border-white/[0.08] p-5">

                  <div>
                    <h4 className="font-bold text-white">
                      All Translations
                    </h4>

                    <p className="mt-1 text-xs text-slate-400">
                      {history.length} saved translation(s)
                    </p>
                  </div>

                  <button
                    onClick={loadHistory}
                    disabled={historyLoading}
                    className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300 disabled:opacity-50"
                    title="Refresh history"
                  >
                    <RefreshCw
                      size={17}
                      className={historyLoading ? "animate-spin" : ""}
                    />
                  </button>

                </div>


                {historyLoading ? (

                  <div className="flex justify-center py-16">
                    <Loader2
                      className="animate-spin text-violet-400"
                      size={27}
                    />
                  </div>

                ) : history.length > 0 ? (

                  <div className="divide-y divide-white/[0.06]">

                    {history.map((item) => (

                      <div
                        key={item.id}
                        className="p-5 transition hover:bg-white/[0.025]"
                      >

                        <div className="flex flex-col justify-between gap-4 sm:flex-row">

                          <div className="min-w-0 flex-1">

                            <div className="mb-3 flex flex-wrap items-center gap-2">

                              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                                {item.source_language} → {item.target_language}
                              </span>

                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                                {item.tone}
                              </span>

                              <span className="text-xs text-slate-500">
                                {formatDate(item.created_at)}
                              </span>

                            </div>


                            <p className="text-sm font-semibold text-slate-200">
                              {item.original_text}
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                              {item.translated_text}
                            </p>

                          </div>


                          <div className="flex shrink-0 items-start gap-2">

                            <button
                              onClick={() => handleUseHistory(item)}
                              className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
                              title="Use translation"
                            >
                              <Languages size={17} />
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                              title="Delete translation"
                            >
                              {deletingId === item.id ? (

                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />

                              ) : (

                                <Trash2 size={17} />

                              )}
                            </button>

                          </div>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="py-16 text-center">

                    <History
                      size={35}
                      className="mx-auto mb-3 text-slate-600"
                    />

                    <p className="font-semibold text-slate-300">
                      No translations yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Your saved translations will appear here.
                    </p>

                    <button
                      onClick={() => navigatePage("translator")}
                      className="mt-5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-blue-500"
                    >
                      Start translating
                    </button>

                  </div>

                )}

              </div>

            </section>

          )}


          {/* ==================================
              FOOTER
          ================================== */}

          <footer className="border-t border-white/[0.08] pt-5 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} NEXORA AI LAB · LINGUA AI ·
            Intelligent Translation Platform
          </footer>

        </div>

      </main>

    </div>
  );
}


// ==========================================
// APPLICATION ENTRY
// ==========================================

export default function App() {
  return <Dashboard />;
}
