
import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Paperclip,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatWindow({ messages, onSend, loading }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col bg-[#080b16]">

      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
            <Bot size={21} />
          </div>

          <div>
            <h2 className="font-semibold">NEXORA Assistant</h2>
            <p className="text-xs text-green-400">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-400" />
              AI Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
          <Sparkles size={14} />
          Powered by Groq
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-7">

          {messages.length === 0 ? (
            <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600/30 to-blue-500/20 text-violet-300">
                <Sparkles size={38} />
              </div>

              <h1 className="mb-3 text-3xl font-bold">
                Bonjour ! Je suis{" "}
                <span className="text-violet-400">NEXORA</span>
              </h1>

              <p className="max-w-md text-gray-400">
                Votre assistant intelligent. Posez-moi une question,
                demandez une explication ou partagez vos idées.
              </p>

              <div className="mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-2">
                {[
                  "Explique-moi l'intelligence artificielle.",
                  "Aide-moi à apprendre Python.",
                  "Donne-moi des idées de projets.",
                  "Explique-moi le Machine Learning.",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSend(suggestion)}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm text-gray-300 transition hover:border-violet-500/40 hover:bg-violet-500/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
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
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    message.role === "user"
                      ? "bg-blue-600"
                      : "bg-violet-600"
                  }`}
                >
                  {message.role === "user" ? (
                    <User size={19} />
                  ) : (
                    <Bot size={19} />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    message.role === "user"
                      ? "bg-blue-600/20 text-blue-50"
                      : "border border-white/10 bg-[#111827] text-gray-200"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none break-words prose-pre:overflow-x-auto prose-pre:rounded-xl prose-code:text-violet-300">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
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
                NEXORA réfléchit...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="border-t border-white/10 bg-[#0b0f1c] px-4 py-5 sm:px-8">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-white/10 bg-[#111827] p-3 transition focus-within:border-violet-500/50"
        >
          <button
            type="button"
            disabled
            title="Pièces jointes bientôt disponibles"
            className="mb-1 rounded-lg p-2 text-gray-600"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Écrivez votre message..."
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-600">
          NEXORA CHAT peut parfois produire des réponses incorrectes.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
