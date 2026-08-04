import { useMemo, useState } from "react";
import {
  Users,
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Bot,
  Send,
} from "lucide-react";
import {
  useCrmList,
  useCrmCreate,
  useCrmMove,
  useCrmRemove,
} from "../../queries/painel";
import { Panel, Stat, Field, inputCls, Btn, Badge, SectionTitle } from "./ui";

const STAGES = [
  { id: "T-04", label: "T-04 · Prospecção", tone: "muted" as const },
  { id: "T-03", label: "T-03 · Qualificado", tone: "cyan" as const },
  { id: "T-02", label: "T-02 · Onboarding", tone: "amber" as const },
  { id: "T-01", label: "T-01 · Cliente", tone: "green" as const },
];

type Lead = ReturnType<typeof useCrmList>["data"] extends (infer T)[] | undefined
  ? T
  : never;

function scoreTone(score: number) {
  if (score >= 75) return "green" as const;
  if (score >= 40) return "amber" as const;
  return "muted" as const;
}

export function B2BKanban() {
  const { data: leads = [], isLoading } = useCrmList();
  const create = useCrmCreate();
  const move = useCrmMove();
  const remove = useCrmRemove();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    company: "",
    score: "",
    ltvPredicted: "",
  });

  const grouped = useMemo(() => {
    const map: Record<string, Lead[]> = {
      "T-04": [],
      "T-03": [],
      "T-02": [],
      "T-01": [],
    };
    for (const l of leads) (map[l.stage] ?? map["T-04"]).push(l);
    return map;
  }, [leads]);

  const pipelineLtv = leads.reduce((s, l) => s + (l.ltvPredicted || 0), 0);
  const clients = grouped["T-01"].length;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contact) return;
    create.mutate(
      {
        name: form.name,
        contact: form.contact,
        company: form.company || undefined,
        score: form.score ? Number(form.score) : 0,
        ltvPredicted: form.ltvPredicted ? Number(form.ltvPredicted) : 0,
      },
      {
        onSuccess: () => {
          setForm({
            name: "",
            contact: "",
            company: "",
            score: "",
            ltvPredicted: "",
          });
          setShowForm(false);
        },
      },
    );
  }

  const idxOf = (stage: string) => STAGES.findIndex((s) => s.id === stage);

  return (
    <div>
      <SectionTitle
        icon={<Users className="h-4 w-4" />}
        title="Belgos AI · Demand Engine (B2B)"
        subtitle="Pipeline autônomo de aquisição — do primeiro contato ao cliente ativo."
        accent="cyan"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Leads no pipeline" value={String(leads.length)} accent="cyan" />
        <Stat label="Clientes (T-01)" value={String(clients)} accent="green" />
        <Stat
          label="LTV previsto"
          value={`R$ ${pipelineLtv.toLocaleString("pt-BR")}`}
          accent="white"
        />
        <Stat
          label="Conversão"
          value={`${leads.length ? Math.round((clients / leads.length) * 100) : 0}%`}
          accent="purple"
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <Btn onClick={() => setShowForm((s) => !s)} variant="ghost">
          <Plus className="h-3.5 w-3.5" /> Novo lead
        </Btn>
        {isLoading && (
          <span className="font-mono text-[10px] text-[#606d80]">
            sincronizando…
          </span>
        )}
      </div>

      {showForm && (
        <Panel className="mb-5 p-4">
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-5">
            <Field label="Nome">
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Empresa / contato"
              />
            </Field>
            <Field label="Contato">
              <input
                className={inputCls}
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="WhatsApp / e-mail"
              />
            </Field>
            <Field label="Empresa">
              <input
                className={inputCls}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Segmento"
              />
            </Field>
            <Field label="Score (0-100)">
              <input
                className={inputCls}
                type="number"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                placeholder="0"
              />
            </Field>
            <Field label="LTV previsto (R$)">
              <input
                className={inputCls}
                type="number"
                value={form.ltvPredicted}
                onChange={(e) =>
                  setForm({ ...form, ltvPredicted: e.target.value })
                }
                placeholder="0"
              />
            </Field>
            <div className="md:col-span-5">
              <Btn type="submit" disabled={create.isPending}>
                {create.isPending ? "Salvando…" : "Adicionar ao pipeline"}
              </Btn>
            </div>
          </form>
        </Panel>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        {STAGES.map((stage) => (
          <div key={stage.id}>
            <div className="mb-2 flex items-center justify-between">
              <Badge tone={stage.tone}>{stage.label}</Badge>
              <span className="font-mono text-[10px] text-[#606d80]">
                {grouped[stage.id].length}
              </span>
            </div>
            <div className="min-h-[300px] space-y-2 rounded-lg border border-[#1f242d] bg-[#0d0f12]/50 p-2">
              {grouped[stage.id].map((lead) => {
                const i = idxOf(lead.stage);
                return (
                  <div
                    key={lead.id}
                    className="rounded border border-[#1f242d] bg-[#050505] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-mono text-xs font-bold text-[#e0e6ed]">
                          {lead.name}
                        </div>
                        <div className="truncate font-mono text-[10px] text-[#606d80]">
                          {lead.company || lead.contact}
                        </div>
                      </div>
                      <button
                        onClick={() => remove.mutate({ id: lead.id })}
                        className="text-[#606d80] hover:text-red-400"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={scoreTone(lead.score)}>
                        Score {lead.score}
                      </Badge>
                      {lead.ltvPredicted > 0 && (
                        <span className="font-mono text-[10px] text-[#00ff66]">
                          R$ {lead.ltvPredicted.toLocaleString("pt-BR")}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        disabled={i <= 0}
                        onClick={() =>
                          move.mutate({
                            id: lead.id,
                            stage: STAGES[i - 1].id as "T-04",
                          })
                        }
                        className="text-[#606d80] hover:text-[#00f0ff] disabled:opacity-20"
                        aria-label="Voltar estágio"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <span className="font-mono text-[9px] uppercase text-[#3a4453]">
                        {lead.source}
                      </span>
                      <button
                        disabled={i >= STAGES.length - 1}
                        onClick={() =>
                          move.mutate({
                            id: lead.id,
                            stage: STAGES[i + 1].id as "T-04",
                          })
                        }
                        className="text-[#606d80] hover:text-[#00ff66] disabled:opacity-20"
                        aria-label="Avançar estágio"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {grouped[stage.id].length === 0 && (
                <div className="py-8 text-center font-mono text-[10px] text-[#3a4453]">
                  vazio
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <SdrChat leadCount={leads.length} />
    </div>
  );
}

function SdrChat({ leadCount }: { leadCount: number }) {
  const [messages, setMessages] = useState<
    { role: "sdr" | "user"; text: string }[]
  >([
    {
      role: "sdr",
      text: `Belgos SDR online. Monitorando ${leadCount} lead(s) no pipeline. Pergunte sobre triagem, qualificação ou próximos passos.`,
    },
  ]);
  const [input, setInput] = useState("");

  function reply(q: string): string {
    const t = q.toLowerCase();
    if (t.includes("qualific"))
      return "Critério de qualificação: score ≥ 40 + fit de ticket. Leads T-04 com score baixo entram em nutrição automática.";
    if (t.includes("prioridade") || t.includes("prior"))
      return "Priorize leads T-03 com LTV previsto alto — maior probabilidade de fechamento no ciclo atual.";
    if (t.includes("onboarding") || t.includes("t-02"))
      return "Em T-02, dispare o checklist de onboarding e agende o kickoff em até 48h para reduzir churn inicial.";
    return "Recomendo revisar leads parados em T-03 há mais de 7 dias e reengajar via WhatsApp com prova social.";
  }

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      { role: "sdr", text: reply(q) },
    ]);
    setInput("");
  }

  return (
    <Panel className="mt-6 p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff]">
        <Bot className="h-4 w-4" /> SDR Triage · Belgos AI
      </div>
      <div className="mb-3 max-h-52 space-y-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`font-mono text-[11px] ${
              m.role === "sdr" ? "text-[#00f0ff]" : "text-[#e0e6ed]"
            }`}
          >
            <span className="text-[#3a4453]">
              {m.role === "sdr" ? "SDR> " : "você> "}
            </span>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          className={inputCls}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte à triagem…"
        />
        <Btn type="submit">
          <Send className="h-3.5 w-3.5" />
        </Btn>
      </form>
    </Panel>
  );
}
