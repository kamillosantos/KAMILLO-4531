import { useState } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Play } from "lucide-react";
import { usePreflightList, usePreflightRun } from "../../queries/painel";
import { Panel, Field, inputCls, Btn, Badge, SectionTitle } from "./ui";

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between rounded border px-3 py-2 font-mono text-xs transition ${
        value
          ? "border-[#00ff66]/40 bg-[#00ff66]/10 text-[#00ff66]"
          : "border-[#1f242d] bg-[#050505] text-[#606d80]"
      }`}
    >
      <span>{label}</span>
      {value ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
    </button>
  );
}

const verdictTone: Record<string, "green" | "red" | "amber"> = {
  aprovado: "green",
  reprovado: "red",
  atencao: "amber",
};

export function Roboavaliador() {
  const { data: history = [] } = usePreflightList();
  const run = usePreflightRun();
  const [form, setForm] = useState({
    domain: "",
    spf: false,
    dkim: false,
    dmarc: false,
    trackingOk: false,
    spamScore: "2.5",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.domain) return;
    run.mutate(
      {
        domain: form.domain,
        spf: form.spf,
        dkim: form.dkim,
        dmarc: form.dmarc,
        trackingOk: form.trackingOk,
        spamScore: Number(form.spamScore),
      },
      { onSuccess: () => setForm({ ...form, domain: "" }) },
    );
  }

  return (
    <div>
      <SectionTitle
        icon={<ShieldCheck className="h-4 w-4" />}
        title="Roboavaliador · Pre-Flight de Entregabilidade"
        subtitle="Auditoria SPF / DKIM / DMARC, spam score e rastreamento antes de qualquer disparo."
        accent="green"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-4">
          <form onSubmit={submit} className="space-y-3">
            <Field label="Domínio de envio">
              <input
                className={inputCls}
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="mail.kamillosantos.com.br"
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Toggle
                label="SPF"
                value={form.spf}
                onChange={(v) => setForm({ ...form, spf: v })}
              />
              <Toggle
                label="DKIM"
                value={form.dkim}
                onChange={(v) => setForm({ ...form, dkim: v })}
              />
              <Toggle
                label="DMARC"
                value={form.dmarc}
                onChange={(v) => setForm({ ...form, dmarc: v })}
              />
              <Toggle
                label="Tracking / Pixel"
                value={form.trackingOk}
                onChange={(v) => setForm({ ...form, trackingOk: v })}
              />
            </div>
            <Field label="Spam score (0-10, quanto menor melhor)">
              <input
                className={inputCls}
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.spamScore}
                onChange={(e) =>
                  setForm({ ...form, spamScore: e.target.value })
                }
              />
            </Field>
            <Btn type="submit" disabled={run.isPending}>
              <Play className="h-3.5 w-3.5" />
              {run.isPending ? "Avaliando…" : "Rodar Pre-Flight"}
            </Btn>
          </form>

          <div className="mt-4 rounded border border-[#1f242d] bg-[#050505] p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#606d80]">
              Veredito calculado
            </div>
            <div className="mt-1 font-mono text-xs text-[#e0e6ed]">
              {form.spf && form.dkim && form.dmarc && Number(form.spamScore) < 5
                ? form.trackingOk
                  ? "✅ APROVADO — pronto para disparo"
                  : "⚠️ ATENÇÃO — autenticação ok, mas tracking pendente"
                : "❌ REPROVADO — corrija autenticação ou spam score"}
            </div>
          </div>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-b border-[#1f242d] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#606d80]">
            Histórico de auditorias
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between border-b border-[#1f242d]/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs text-[#e0e6ed]">
                    {h.domain}
                  </div>
                  <div className="mt-1 flex gap-1">
                    <Badge tone={h.spf ? "green" : "red"}>SPF</Badge>
                    <Badge tone={h.dkim ? "green" : "red"}>DKIM</Badge>
                    <Badge tone={h.dmarc ? "green" : "red"}>DMARC</Badge>
                    <Badge tone={h.spamScore < 5 ? "green" : "red"}>
                      spam {h.spamScore}
                    </Badge>
                  </div>
                </div>
                <Badge tone={verdictTone[h.verdict] ?? "muted"}>
                  {h.verdict}
                </Badge>
              </div>
            ))}
            {history.length === 0 && (
              <div className="px-4 py-10 text-center font-mono text-[10px] text-[#3a4453]">
                Nenhuma auditoria rodada ainda.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
