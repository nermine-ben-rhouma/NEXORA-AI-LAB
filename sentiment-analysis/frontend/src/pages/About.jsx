
import {
  BrainCircuit,
  Target,
  Cpu,
  Database,
  Code2,
  Sparkles,
} from "lucide-react";

function About() {
  const technologies = [
    {
      name: "Python",
      description: "Langage utilisé pour développer le backend.",
      icon: Code2,
    },
    {
      name: "FastAPI",
      description: "Framework pour créer les API REST.",
      icon: Cpu,
    },
    {
      name: "LangChain & Groq",
      description: "Technologies utilisées pour l'analyse intelligente.",
      icon: BrainCircuit,
    },
    {
      name: "SQLite",
      description: "Stockage des résultats et de l'historique.",
      icon: Database,
    },
    {
      name: "React",
      description: "Création de l'interface utilisateur.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b16] p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-blue-600/10 p-8 md:p-12">
          <div className="mb-6 inline-flex rounded-2xl bg-violet-500/20 p-4">
            <BrainCircuit size={42} className="text-violet-400" />
          </div>

          <h1 className="text-4xl font-bold">
            About <span className="text-violet-400">NEXORA AI</span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            NEXORA AI is an intelligent sentiment analysis platform
            designed to automatically identify emotions and opinions
            expressed in textual data using artificial intelligence
            and natural language processing.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">
            <Target size={30} className="mb-4 text-violet-400" />
            <h2 className="mb-3 text-xl font-bold">Our Mission</h2>
            <p className="leading-7 text-slate-400">
              Our mission is to simplify text analysis by transforming
              unstructured textual data into meaningful sentiment
              insights that support better understanding and decision-making.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">
            <BrainCircuit size={30} className="mb-4 text-blue-400" />
            <h2 className="mb-3 text-xl font-bold">Our Approach</h2>
            <p className="leading-7 text-slate-400">
              The platform combines artificial intelligence,
              natural language processing and modern web technologies
              to classify texts into positive, negative and neutral sentiments.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">
            Technologies Used
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech) => {
              const Icon = tech.icon;

              return (
                <div
                  key={tech.name}
                  className="rounded-2xl border border-white/10 bg-[#111729] p-6 transition hover:border-violet-500/50"
                >
                  <Icon size={28} className="mb-4 text-violet-400" />
                  <h3 className="mb-2 font-semibold">{tech.name}</h3>
                  <p className="text-sm leading-6 text-slate-400">
                    {tech.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © 2026 NEXORA AI — Sentiment Analysis Platform
        </footer>
      </div>
    </div>
  );
}

export default About;
