import { useState, useEffect, useCallback } from "react";
import { PanelLeftOpen } from "lucide-react";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

import {
  getDocuments,
  getQuestions,
  askQuestion,
  deleteDocument,
} from "./services/documentService";

function App() {
  const [documents, setDocuments] = useState([]);
  const [activeDocument, setActiveDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les documents
  const loadDocuments = useCallback(async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      setError("Impossible de charger les documents.");
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Nouveau document
  const handleNewDocument = () => {
    setActiveDocument(null);
    setMessages([]);
    setError("");
  };

  // Sélectionner un document
  const handleSelectDocument = async (id) => {
    try {
      setError("");

      const document = documents.find((item) => item.id === id);

      if (!document) return;

      setActiveDocument(document);

      const history = await getQuestions(id);

      const formattedMessages = history.flatMap((item) => [
        {
          id: `user-${item.id}`,
          role: "user",
          content: item.question,
        },
        {
          id: `assistant-${item.id}`,
          role: "assistant",
          content: item.answer,
        },
      ]);

      setMessages(formattedMessages);
    } catch (err) {
      setError("Impossible de charger l'historique.");
    }
  };

  // Après téléchargement
  const handleUploadSuccess = async (document) => {
    setActiveDocument(document);
    setMessages([]);
    setError("");
    await loadDocuments();
  };

  // Envoyer une question
  const handleSendMessage = async (question) => {
    if (!activeDocument || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: question,
      },
    ]);

    setLoading(true);

    try {
      const result = await askQuestion(
        activeDocument.id,
        question
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (err) {
      setMessages((previous) => previous.slice(0, -1));

      setError(
        err.response?.data?.detail ||
        "Impossible de générer une réponse."
      );
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un document
  const handleDeleteDocument = async (id) => {
    try {
      await deleteDocument(id);

      if (activeDocument?.id === id) {
        handleNewDocument();
      }

      await loadDocuments();
    } catch (err) {
      setError("Impossible de supprimer ce document.");
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#080b16] text-white">

      {sidebarOpen && (
        <Sidebar
          documents={documents}
          activeDocumentId={activeDocument?.id}
          onNewDocument={handleNewDocument}
          onSelectDocument={handleSelectDocument}
          onDeleteDocument={handleDeleteDocument}
          onToggleSidebar={() => setSidebarOpen(false)}
        />
      )}

      <main className="relative min-w-0 flex-1">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-4 z-10 rounded-lg border border-white/10 bg-[#111827] p-2 text-gray-300 transition hover:bg-violet-600 hover:text-white"
            title="Afficher la barre latérale"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}

        <ChatWindow
          activeDocument={activeDocument}
          messages={messages}
          onUploadSuccess={handleUploadSuccess}
          onSendMessage={handleSendMessage}
          loading={loading}
        />

        {error && (
          <div className="fixed bottom-24 right-6 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 shadow-lg">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-3 text-white"
            >
              ✕
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;