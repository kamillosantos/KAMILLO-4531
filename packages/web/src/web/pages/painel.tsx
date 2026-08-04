import { useState } from "react";
import { Link } from "wouter";
import {
  Cpu,
  Users,
  Zap,
  ShieldCheck,
  Activity,
  Code2,
  ArrowLeft,
} from "lucide-react";
import { Seo } from "../components/seo";
import { B2BKanban } from "../components/painel/b2b-kanban";
import { B2CFunnel } from "../components/painel/b2c-funnel";
import { Roboavaliador } from "../components/painel/roboavaliador";
import { RevOps } from "../components/painel/revops";
import { DevEngine } from "../components/painel/dev-engine";

type Tab = "b2b" | "b2c" | "robo" | "revops" | "dev";

const NAV: { id: Tab; label: string; icon: typeof Users; accent: string }[] = [
  { id: "b2b", label: "Demand Engine · B2B", icon: Users, accent: "#00f0ff" },
  { id: "b2c", label: "101X Funnel · B2C", icon: Zap, accent: "#a06bff" },
  { id: "robo", label: "Roboavaliador", icon: ShieldCheck, accent: "#00ff66" },
  { id: "revops", label: "RevOps & LGPD", icon: Activity, accent: "#a06bff" },
  { id: "dev", label: "Dev Engine", icon: Code2, accent: "#00ff66" },
];

export default function PainelPage() {
  const [tab, setTab] = useState<Tab>("b2b");

  return (
    <div className="min-h-screen bg-[#050505] font-mono text-[#e0e6ed]">
      <Seo
        title="Painel · #KamilloSantosProtocol"
        description="Painel operacional interno — Demand Engine B2B, 101X Funnel B2C, Roboavaliador e RevOps."
        path="/painel"
        noindex
      />

      {/* Top OS bar */}
      <header className="flex items-center justify-between border-b border-[#1f242d] bg-[#0d0f12] px-6 py-3">
        <div className="flex items-center gap-3">
          <Cpu className="h-5 w-5 animate-pulse text-[#00ff66]" />
          <span className="text-xs font-bold tracking-widest text-[#00ff66]">
            #KAMILLOSANTOS_PROTOCOL{" "}
            <span className="text-[10px] text-[#606d80]">v2026.1.0</span>
          </span>
        </div>
        <div className="hidden items-center gap-6 text-[10px] text-[#606d80] md:flex">
          <span>
            CORE:{" "}
            <strong className="text-[#e0e6ed]">KAMILLO IA</strong>
          </span>
          <span>
            MODE: <strong className="text-[#00ff66]">AUTONOMOUS</strong>
          </span>
          <Link
            href="/"
            className="flex items-center gap-1 text-[#606d80] hover:text-[#00ff66]"
          >
            <ArrowLeft className="h-3 w-3" /> site
          </Link>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-[#1f242d] bg-[#0d0f12] p-4 md:min-h-[calc(100vh-49px)] md:w-64 md:border-b-0 md:border-r">
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-[#606d80]">
            Engines & Views
          </div>
          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {NAV.map((n) => {
              const active = tab === n.id;
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className={`flex flex-shrink-0 items-center gap-3 rounded px-3 py-2.5 text-xs transition ${
                    active
                      ? "bg-[#1f242d] border-l-2"
                      : "border-l-2 border-transparent text-[#606d80] hover:bg-[#1f242d]/50"
                  }`}
                  style={active ? { borderColor: n.accent, color: n.accent } : {}}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{n.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 hidden rounded border border-[#1f242d] bg-[#050505] p-3 text-[10px] md:block">
            <div className="text-[#606d80]">Stack soberana</div>
            <div className="mt-1 text-[#e0e6ed]">Bun · Hono · Drizzle · Turso</div>
            <div className="mt-2 text-[#606d80]">Persistência</div>
            <div className="text-[#00ff66]">CRUD real · access control API</div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden bg-[#050505] p-6">
          {tab === "b2b" && <B2BKanban />}
          {tab === "b2c" && <B2CFunnel />}
          {tab === "robo" && <Roboavaliador />}
          {tab === "revops" && <RevOps />}
          {tab === "dev" && <DevEngine />}
        </main>
      </div>
    </div>
  );
}
