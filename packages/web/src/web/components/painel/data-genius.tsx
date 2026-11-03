import { useCallback, useEffect, useState } from "react";
import { Activity, RefreshCw, ShieldAlert } from "lucide-react";

type EventRow = {
  id: number;
  eventId: string;
  eventType: string;
  occurredAt: string;
  sourceSystem: string;
  sourceComponent: string;
  environment: string;
  eventClass: string;
  correlationId: string;
  status: string;
  payload: unknown;
};
type EventResponse = {
  source: string;
  evidence_class: string;
  count: number;
  events: EventRow[];
  integrations_not_instrumented: string[];
};

export function DataGenius() {
  const [data, setData] = useState<EventResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState("all");
  const [eventClass, setEventClass] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (environment !== "all") params.set("environment", environment);
      if (eventClass !== "all") params.set("event_class", eventClass);
      const response = await fetch(`/api/observability/events?${params.toString()}`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 401 ? "Sessão administrativa necessária. Entre novamente no CRM." : `Falha ao consultar eventos (HTTP ${response.status}).`);
      setData(await response.json() as EventResponse);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Falha desconhecida ao consultar Data Genius.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [environment, eventClass]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { void load(); }, 15_000);
    return () => window.clearInterval(timer);
  }, [load]);

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[#00f0ff]"><Activity className="h-5 w-5" /><h1 className="text-lg font-bold tracking-widest">DATA GENIUS · EVENT LEDGER</h1></div>
          <p className="mt-1 text-xs text-[#78869a]">Registros persistidos no banco desta aplicação · atualização automática a cada 15s · sem fontes não instrumentadas.</p>
        </div>
        <button onClick={() => void load()} disabled={loading} className="flex items-center gap-2 rounded border border-[#263342] px-3 py-2 text-xs text-[#cbd5e1] hover:border-[#00f0ff] disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
      </header>

      <div className="flex flex-wrap gap-3">
        <label className="text-[10px] uppercase tracking-wider text-[#78869a]">Ambiente
          <select value={environment} onChange={(e) => setEnvironment(e.target.value)} className="ml-2 rounded border border-[#263342] bg-[#0d0f12] px-2 py-2 text-xs text-white">
            <option value="all">Todos</option><option value="production">Produção</option><option value="staging">Staging</option><option value="development">Desenvolvimento</option>
          </select>
        </label>
        <label className="text-[10px] uppercase tracking-wider text-[#78869a]">Classe
          <select value={eventClass} onChange={(e) => setEventClass(e.target.value)} className="ml-2 rounded border border-[#263342] bg-[#0d0f12] px-2 py-2 text-xs text-white">
            <option value="all">Todas</option><option value="OBSERVED">Observados</option><option value="TEST">Testes</option><option value="PREDICTED">Previstos</option><option value="SYNTHETIC">Sintéticos</option>
          </select>
        </label>
      </div>

      {error && <div className="flex items-start gap-2 rounded border border-amber-900/60 bg-amber-950/20 p-3 text-xs text-amber-200"><ShieldAlert className="h-4 w-4 shrink-0" />{error}</div>}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded border border-[#263342] bg-[#0d0f12] p-4"><div className="text-[10px] text-[#78869a]">REGISTROS RETORNADOS</div><div className="mt-2 text-2xl font-bold text-[#00f0ff]">{data?.count ?? "—"}</div></div>
        <div className="rounded border border-[#263342] bg-[#0d0f12] p-4"><div className="text-[10px] text-[#78869a]">FONTE</div><div className="mt-2 text-sm font-semibold text-white">{data?.source ?? "Não consultado"}</div></div>
        <div className="rounded border border-[#263342] bg-[#0d0f12] p-4"><div className="text-[10px] text-[#78869a]">EVIDÊNCIA</div><div className="mt-2 text-sm font-semibold text-white">{data?.evidence_class ?? "—"}</div></div>
      </div>

      <div className="overflow-x-auto rounded border border-[#263342]">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-[#0d0f12] text-[10px] uppercase tracking-wider text-[#78869a]"><tr><th className="p-3">Horário UTC</th><th className="p-3">Evento</th><th className="p-3">Origem</th><th className="p-3">Ambiente / Classe</th><th className="p-3">Estado</th></tr></thead>
          <tbody>
            {data?.events.map((event) => <tr key={event.eventId} className="border-t border-[#1f2937] text-[#d7e0ea]">
              <td className="whitespace-nowrap p-3 font-mono text-[#9aa8b8]">{event.occurredAt}</td>
              <td className="p-3"><div className="font-semibold">{event.eventType}</div><div className="mt-1 text-[10px] text-[#78869a]">{event.eventId}</div></td>
              <td className="p-3">{event.sourceSystem}<div className="mt-1 text-[10px] text-[#78869a]">{event.sourceComponent}</div></td>
              <td className="p-3">{event.environment}<div className="mt-1 text-[10px] text-[#78869a]">{event.eventClass}</div></td>
              <td className="p-3">{event.status}</td>
            </tr>)}
            {data && data.events.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-[#78869a]">Nenhum evento persistido corresponde aos filtros.</td></tr>}
            {!data && !error && <tr><td colSpan={5} className="p-8 text-center text-[#78869a]">Consultando o ledger…</td></tr>}
          </tbody>
        </table>
      </div>

      {data?.integrations_not_instrumented?.length ? <div className="rounded border border-[#263342] bg-[#0d0f12] p-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#78869a]">Fontes externas a conectar e verificar</div>
        <div className="flex flex-wrap gap-2">{data.integrations_not_instrumented.map((item) => <span key={item} className="rounded bg-[#1a2029] px-2 py-1 text-[10px] text-[#aab6c5]">{item}</span>)}</div>
      </div> : null}
    </section>
  );
}
