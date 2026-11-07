import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Upload,
  FileCheck,
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { uploadDocument, askQuestion } from "../services/documentService";

function ChatWindow({
  activeDocument,
  messages,
  onUploadSuccess,
  onSendMessage,
  loading,
}) {
  const [question, setQuestion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Veuillez sélectionner un fichier PDF.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const document = await uploadDocument(file);
      onUploadSuccess(document);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Impossible de télécharger le document."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!question.trim() || !activeDocument || loading) return;

    const currentQuestion = question.trim();
    setQuestion("");
    setError("");

    await onSendMessage(currentQuestion);
  };

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col bg-[#080b16]">

      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
            <FileText size={21} />
          </div>

          <div>
            <h2 className="font-semibold">DOCUVISION Assistant</h2>
            <p className="text-xs text-green-400">AI Document Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
          <Sparkles size={14} />
          Powered by Groq
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-7">

          {!activeDocument ? (
            <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">

              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600/30 to-blue-500/20 text-violet-300">
                <FileText size={38} />
              </div>

              <h1 className="mb-3 text-3xl font-bold">
                Bienvenue sur{" "}
                <span className="text-violet-400">DOCUVISION</span>
              </h1>

              <p className="max-w-md text-gray-400">
                Téléchargez un document PDF et posez vos questions.
                Votre assistant IA analysera son contenu.
              </p>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mt-8 flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-4 font-medium transition hover:bg-violet-500 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Upload size={20} />
                )}

                {uploading ? "Analyse du document..." : "Importer un PDF"}
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Format PDF • Taille maximale : 10 Mo
              </p>
            </div>
          ) : (
            <>
              {/* Document sélectionné */}
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <FileCheck size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-green-400">Document analysé</p>
                  <p className="truncate text-sm font-medium">
                    {activeDocument.filename}
                  </p>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-white/5 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
                >
                  Changer
                </button>
              </div>

              {/* Messages */}
              {messages.length === 0 ? (
                <div className="py-16 text-center">
                  <Sparkles size={32} className="mx-auto mb-4 text-violet-400" />
                  <h2 className="mb-2 text-xl font-semibold">
                    Votre document est prêt !
                  </h2>
                  <p className="text-sm text-gray-400">
                    Posez une question pour commencer l'analyse.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id ?? index}
                    className={`flex gap-3 ${
                      message.role === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      message.role === "user"
                        ? "bg-blue-600"
                        : "bg-violet-600"
                    }`}>
                      {message.role === "user" ? (
                        <User size={19} />
                      ) : (
                        <Bot size={19} />
                      )}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === "user"
                        ? "bg-blue-600/20 text-blue-50"
                        : "border border-white/10 bg-[#111827] text-gray-200"
                    }`}>
                      {message.role === "assistant" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
                    <Bot size={19} />
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-sm text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    DOCUVISION analyse votre document...
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Question input */}
      {activeDocument && (
        <div className="border-t border-white/10 bg-[#0b0f1c] px-4 py-5 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-white/10 bg-[#111827] p-3 focus-within:border-violet-500/50"
          >
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Posez une question sur votre document..."
              rows={1}
              className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleUpload}
        className="hidden"
      />

      {error && (
        <div className="fixed bottom-24 right-6 max-w-md rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default ChatWindow;