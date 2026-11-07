
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import About from "./pages/About";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-[#080b16]">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="min-w-0 flex-1">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "history" && <History />}
        {activePage === "about" && <About />}
      </main>
    </div>
  );
}

export default App;
