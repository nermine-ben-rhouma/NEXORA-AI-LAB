
import {
  LayoutDashboard,
  History,
  Info,
  BrainCircuit,
} from "lucide-react";

function Sidebar({ activePage, onNavigate }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
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
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-[#0d1222] p-5">
      <div className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-violet-600 p-3">
          <BrainCircuit size={25} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">NEXORA AI</h1>
          <p className="text-xs text-slate-400">Sentiment Analysis</p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Menu principal
      </p>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">
          NEXORA AI Platform
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Intelligence artificielle pour l'analyse automatique des sentiments.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
