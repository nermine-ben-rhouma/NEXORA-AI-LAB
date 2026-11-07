
import { useState } from "react";
import {
  BrainCircuit,
  Languages,
  Activity,
  MessagesSquare,
  ScanText,
  CloudSun,
  ArrowUpRight,
  ArrowLeft,
  Layers3,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const applications = [
  {
    id: "lingua",
    number: "01",
    name: "LINGUA AI",
    category: "Intelligent Translation",
    description:
      "Translate texts naturally with advanced language models powered by LangChain and Groq.",
    icon: Languages,
    color: "#60A5FA",
    background: "rgba(96,165,250,0.12)",
    url: "http://localhost:5174",
    technology: "LangChain · Groq",
  },
  {
    id: "sentiment",
    number: "02",
    name: "SENTIMENT AI",
    category: "Emotion Intelligence",
    description:
      "Analyze text sentiment and discover emotions, opinions and polarity using AI.",
    icon: Activity,
    color: "#34D399",
    background: "rgba(52,211,153,0.12)",
    url: "http://localhost:5175",
    technology: "LangChain · NLP",
  },
  {
    id: "chat",
    number: "03",
    name: "NEXORA CHAT",
    category: "Conversational AI",
    description:
      "Interact with an intelligent chatbot and experience natural AI conversations.",
    icon: MessagesSquare,
    color: "#C084FC",
    background: "rgba(192,132,252,0.12)",
    url: "http://localhost:5176",
    technology: "LangChain · Groq",
  },
  {
    id: "docuvision",
    number: "04",
    name: "DOCUVISION",
    category: "Intelligent Document OCR",
    description:
      "Extract and process text from documents and images using intelligent OCR.",
    icon: ScanText,
    color: "#FBBF24",
    background: "rgba(251,191,36,0.12)",
    url: "http://localhost:5177",
    technology: "OCR · LangChain",
  },
  {
    id: "weather",
    number: "05",
    name: "WEATHERFLOW AI",
    category: "Intelligent Weather Assistant",
    description:
      "Explore current weather, interactive maps and seven-day forecasts for cities worldwide.",
    icon: CloudSun,
    color: "#38BDF8",
    background: "rgba(56,189,248,0.12)",
    url: "http://localhost:5178",
    technology: "Weather API · React",
  },
];

function App() {
  const [activeApp, setActiveApp] = useState(null);

  const openApplication = (app) => {
    setActiveApp(app);
  };

  return (
    <div className="portal">

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h2>NEXORA</h2>
            <span>AI LAB · INTELLIGENT SYSTEMS</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="status">
            <span className="status-dot"></span>
            ALL SYSTEMS
          </div>

          <span className="product-count">05 AI PRODUCTS</span>
        </div>
      </header>

      {activeApp ? (
        <main className="application-view">

          <div className="application-toolbar">
            <button
              className="back-button"
              onClick={() => setActiveApp(null)}
            >
              <ArrowLeft size={18} />
              Back to NEXORA
            </button>

            <div className="application-title">
              <span
                className="application-icon"
                style={{
                  color: activeApp.color,
                  background: activeApp.background,
                }}
              >
                <activeApp.icon size={22} />
              </span>

              <div>
                <strong>{activeApp.name}</strong>
                <span>{activeApp.category}</span>
              </div>
            </div>

            <a
              href={activeApp.url}
              target="_blank"
              rel="noreferrer"
              className="external-link"
            >
              <ExternalLink size={17} />
              Open separately
            </a>
          </div>

          <iframe
            key={activeApp.id}
            src={activeApp.url}
            title={activeApp.name}
            className="application-frame"
          />

        </main>
      ) : (
        <main className="dashboard">

          <section className="hero">
            <div className="hero-content">
              <div className="eyebrow">
                <Sparkles size={15} />
                THE NEXT GENERATION OF AI
              </div>

              <h1>
                Intelligence,
                <br />
                designed for <span>everyone.</span>
              </h1>

              <p>
                A unified collection of intelligent applications
                powered by Large Language Models and modern AI technologies.
              </p>

              <div className="hero-details">
                <div>
                  <Layers3 size={18} />
                  <span>5 integrated applications</span>
                </div>

                <div>
                  <BrainCircuit size={18} />
                  <span>AI-powered experiences</span>
                </div>
              </div>
            </div>

            <div className="hero-decoration">
              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>
              <div className="brain-symbol">
                <BrainCircuit size={94} strokeWidth={1.2} />
              </div>
              <div className="floating-tag tag-one">AI LAB</div>
              <div className="floating-tag tag-two">INTELLIGENCE</div>
            </div>
          </section>

          <section className="products-section">
            <div className="section-heading">
              <div>
                <span className="section-label">OUR ECOSYSTEM</span>
                <h2>Explore our AI products</h2>
                <p>
                  Select an application to access its dedicated workspace.
                </p>
              </div>

              <span className="available-count">
                05 APPLICATIONS
              </span>
            </div>

            <div className="products-grid">
              {applications.map((app) => {
                const Icon = app.icon;

                return (
                  <button
                    key={app.id}
                    className={`product-card ${app.id === "weather" ? "wide-card" : ""}`}
                    onClick={() => openApplication(app)}
                  >
                    <div className="card-top">
                      <div
                        className="product-icon"
                        style={{
                          color: app.color,
                          background: app.background,
                        }}
                      >
                        <Icon size={25} />
                      </div>

                      <span className="product-number">
                        {app.number}
                      </span>
                    </div>

                    <div className="card-content">
                      <span className="product-category">
                        {app.category}
                      </span>

                      <h3>{app.name}</h3>

                      <p>{app.description}</p>
                    </div>

                    <div className="card-bottom">
                      <span>{app.technology}</span>

                      <span
                        className="launch-icon"
                        style={{ color: app.color }}
                      >
                        <ArrowUpRight size={21} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="footer">
            <div className="footer-brand">
              <BrainCircuit size={18} />
              NEXORA AI LAB
            </div>

            <span>
              © 2026 NEXORA · Intelligence for everyone.
            </span>

          </footer>

        </main>
      )}
    </div>
  );
}

export default App;
