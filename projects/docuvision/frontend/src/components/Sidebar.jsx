import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  PanelLeftClose,
} from "lucide-react";

function Sidebar({
  documents,
  activeDocumentId,
  onNewDocument,
  onSelectDocument,
  onDeleteDocument,
  onToggleSidebar,
}) {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#0d1220]">

      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-500">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold">
              DOCU<span className="text-violet-400">VISION</span>
            </h1>
            <p className="text-xs text-gray-500">AI Document Assistant</p>
          </div>
        </div>

        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-white/10 hover:text-white"
          title="Masquer la barre latérale"
        >
          <PanelLeftClose size={19} />
        </button>
      </div>

      {/* Nouveau document */}
      <div className="p-4">
        <button
          onClick={onNewDocument}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-medium transition hover:bg-violet-500"
        >
          <Plus size={19} />
          Nouveau document
        </button>
      </div>

      {/* Historique */}
      <div className="flex-1 overflow-y-auto px-3">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Mes documents
        </p>

        {documents.length === 0 ? (
          <p className="px-2 py-4 text-sm text-gray-500">
            Aucun document
          </p>
        ) : (
          <div className="space-y-1">
            {documents.map((document) => (
              <div
                key={document.id}
                className={`group flex items-center gap-2 rounded-lg px-3 py-3 transition ${
                  activeDocumentId === document.id
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <button
                  onClick={() => onSelectDocument(document.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <FileText size={17} className="shrink-0" />
                  <span className="truncate text-sm">
                    {document.filename}
                  </span>
                </button>

                <button
                  onClick={() => onDeleteDocument(document.id)}
                  className="shrink-0 rounded p-1 text-gray-500 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 font-bold">
            D
          </div>

          <div>
            <p className="text-sm font-medium">DOCUVISION AI</p>
            <p className="text-xs text-gray-500">Smart PDF Assistant</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;