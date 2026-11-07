
import { useState, useEffect, useCallback } from "react";
import { PanelLeftOpen } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

import {
  sendMessage,
  getConversations,
  getMessages,
  deleteConversation,
  renameConversation,
} from "./services/chatService";

function App() {
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les conversations
  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      setError("Impossible de charger les conversations.");
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Nouvelle conversation
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError("");
  };

  // Sélectionner une conversation
  const handleSelectConversation = async (id) => {
    try {
      setError("");
      setActiveConversationId(id);

      const data = await getMessages(id);
      setMessages(data);
    } catch (err) {
      setError("Impossible de charger les messages.");
    }
  };

  // Envoyer un message
  const handleSendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((previous) => [...previous, userMessage]);
    setLoading(true);
    setError("");

    try {
      const result = await sendMessage(
        text,
        activeConversationId
      );

      setActiveConversationId(result.conversation_id);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.message,
        },
      ]);

      await loadConversations();
    } catch (err) {
      setMessages((previous) => previous.slice(0, -1));
      setError(
        err.response?.data?.detail ||
        "Une erreur est survenue. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une conversation
  const handleDeleteConversation = async (id) => {
    try {
      await deleteConversation(id);

      if (activeConversationId === id) {
        handleNewChat();
      }

      await loadConversations();
    } catch (err) {
      setError("Impossible de supprimer cette conversation.");
    }
  };
  // Renommer une conversation
const handleRenameConversation = async (id, title) => {
  try {
    await renameConversation(id, title);
    await loadConversations();
  } catch (err) {
    setError("Impossible de renommer cette conversation.");
  }
};

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#080b16] text-white">
      {sidebarOpen && (
  <Sidebar
    conversations={conversations}
    activeConversationId={activeConversationId}
    onNewChat={handleNewChat}
    onSelectConversation={handleSelectConversation}
    onDeleteConversation={handleDeleteConversation}
    onRenameConversation={handleRenameConversation}
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
          messages={messages}
          onSend={handleSendMessage}
          loading={loading}
        />

        {error && (
          <div className="fixed bottom-24 right-6 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 shadow-lg">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
