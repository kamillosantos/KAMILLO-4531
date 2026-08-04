import { useState } from "react";
import {
  Code2,
  Play,
  Plus,
  X,
  ShieldCheck,
  GitBranch,
  Server,
  Cloud,
  Boxes,
} from "lucide-react";
import { useDevEngineList, useDevEngineRun } from "../../queries/painel";
import { Panel, Stat, Field, inputCls, Btn, Badge, SectionTitle } from "./ui";

const ARCH = [
  { id: "MICROSERVICES", label: "Microservices", icon: Boxes },
  { id: "MONOLITH_EVOLVED", label: "Monolith Evolved", icon: Server },
  { id: "SERVERLESS", label: "Serverless", icon: Cloud },
];

function fmt(d: Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DevEngine() {
  const { data: runs = [] } = useDevEngineList();
  const run = useDevEngineRun();
  const [form, setForm] = useState({
    projectName: "",
    architectureType: "MICROSERVICES",
    securityLevel: "ENTERPRISE_HIGH",
    apiFirstReady: true,
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featInput, setFeatInput] = useState("");
  const [lastSig, setLastSig] = useState<string | null>(null);

  function addFeature() {
    const v = featInput.trim();
    if (v && !features.includes(v)) setFeatures([...features, v]);
    setFeatInput("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.projectName) return;
    run.mutate(
      {
        projectName: form.projectName,
        architectureType: form.architectureType as "MICROSERVICES",
        securityLevel: form.securityLevel as "ENTERPRISE_HIGH",
        customFeatures: features,
        apiFirstReady: form.apiFirstReady,
      },
      {
        onSuccess: (res) => {
          setLastSig(res.signature);
          setForm({ ...form, projectName: "" });
          setFeatures([]);
        },
      },
    );
  }

  const enterprise = runs.filter(
    (r) => r.securityLevel === "ENTERPRISE_HIGH",
  ).length;

  return (
    <div>
      <SectionTitle
        icon={<Code2 className="h-4 w-4" />}
        title="Kamillo Dev Engine · Software Architecture"
        subtitle="Validação de arquitetura corporativa (API-first, alta escala) com assinatura e trilha de auditoria."
        accent="green"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Projetos arquitetados" value={String(runs.length)} accent="green" />
        <Stat label="Enterprise High" value={String(enterprise)} accent="cyan" />
        <Stat
          label="API-first ready"
          value={String(runs.filter((r) => r.apiFirstReady).length)}
          accent="white"
        />
        <Stat
          label="Assinatura"
          value="VERIFIED"
          accent="purple"
          hint="BRADATA Software House"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-4">
          <form onSubmit={submit} className="space-y-3">
            <Field label="Nome do projeto">
              <input
                className={inputCls}
                value={form.projectName}
                onChange={(e) =>
                  setForm({ ...form, projectName: e.target.value })
                }
                placeholder="Ex: Plataforma de aquisição B2B"
              />
            </Field>

            <div>
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#606d80]">
                Tipo de arquitetura
              </span>
              <div className="grid grid-cols-3 gap-2">
                {ARCH.map((a) => {
                  const active = form.architectureType === a.id;
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, architectureType: a.id })
                      }
                      className={`flex flex-col items-center gap-1 rounded border px-2 py-3 font-mono text-[10px] transition ${
                        active
                          ? "border-[#00ff66]/50 bg-[#00ff66]/10 text-[#00ff66]"
                          : "border-[#1f242d] bg-[#050505] text-[#606d80] hover:border-[#00ff66]/30"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Nível de segurança">
                <select
                  className={inputCls}
                  value={form.securityLevel}
                  onChange={(e) =>
                    setForm({ ...form, securityLevel: e.target.value })
                  }
                >
                  <option value="ENTERPRISE_HIGH">
                    ENTERPRISE_HIGH (HMAC/JWT)
                  </option>
                  <option value="STANDARD">STANDARD</option>
                </select>
              </Field>
              <div>
                <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#606d80]">
                  API-first ready
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, apiFirstReady: !form.apiFirstReady })
                  }
                  className={`w-full rounded border px-3 py-2 font-mono text-xs transition ${
                    form.apiFirstReady
                      ? "border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]"
                      : "border-[#1f242d] bg-[#050505] text-[#606d80]"
                  }`}
                >
                  {form.apiFirstReady ? "SIM" : "NÃO"}
                </button>
              </div>
            </div>

            <div>
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-[#606d80]">
                Custom features
              </span>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={featInput}
                  onChange={(e) => setFeatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  placeholder="Ex: RAG search, CI/CD, multi-tenant"
                />
                <Btn onClick={addFeature} variant="ghost">
                  <Plus className="h-3.5 w-3.5" />
                </Btn>
              </div>
              {features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 rounded border border-[#1f242d] bg-[#050505] px-2 py-0.5 font-mono text-[10px] text-[#e0e6ed]"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() =>
                          setFeatures(features.filter((x) => x !== f))
                        }
                        className="text-[#606d80] hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Btn type="submit" disabled={run.isPending}>
              <Play className="h-3.5 w-3.5" />
              {run.isPending ? "Arquitetando…" : "Acionar Dev Engine"}
            </Btn>

            {lastSig && (
              <div className="rounded border border-[#00ff66]/30 bg-[#00ff66]/5 p-3 font-mono text-[11px] text-[#00ff66]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> SYSTEM_ARCHITECTED
                </div>
                <div className="mt-1 text-[10px] text-[#606d80]">
                  signature: {lastSig}
                </div>
              </div>
            )}
          </form>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#1f242d] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#606d80]">
            <GitBranch className="h-3.5 w-3.5" /> Histórico de acionamentos
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {runs.map((r) => {
              let feats: string[] = [];
              try {
                feats = JSON.parse(r.customFeatures);
              } catch {
                feats = [];
              }
              return (
                <div
                  key={r.id}
                  className="border-b border-[#1f242d]/50 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-xs font-bold text-[#e0e6ed]">
                      {r.projectName}
                    </span>
                    <Badge
                      tone={
                        r.securityLevel === "ENTERPRISE_HIGH" ? "green" : "amber"
                      }
                    >
                      {r.securityAudit}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone="cyan">{r.architectureType}</Badge>
                    {r.apiFirstReady && <Badge tone="muted">API-first</Badge>}
                    {feats.map((f) => (
                      <span
                        key={f}
                        className="font-mono text-[10px] text-[#606d80]"
                      >
                        #{f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-[#3a4453]">
                    {r.signature} · {fmt(r.createdAt)}
                  </div>
                </div>
              );
            })}
            {runs.length === 0 && (
              <div className="px-4 py-10 text-center font-mono text-[10px] text-[#3a4453]">
                Nenhum acionamento registrado.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
