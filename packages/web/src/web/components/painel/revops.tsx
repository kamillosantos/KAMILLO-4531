import { useState } from "react";
import { Activity, Plus, Trash2, ScrollText, ShieldAlert } from "lucide-react";
import {
  useCampaigns,
  useCampaignStats,
  useCampaignCreate,
  useCampaignRemove,
  useAuditLogs,
  useAuditStats,
} from "../../queries/painel";
import { Panel, Stat, Field, inputCls, Btn, Badge, SectionTitle } from "./ui";

const CHANNELS = ["Meta Ads", "Google Ads", "TikTok Ads", "YouTube Ads"];

function fmt(d: Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RevOps() {
  const { data: campaigns = [] } = useCampaigns();
  const { data: cStats } = useCampaignStats();
  const create = useCampaignCreate();
  const remove = useCampaignRemove();
  const { data: logs = [] } = useAuditLogs();
  const { data: aStats } = useAuditStats();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    channel: "Meta Ads",
    spend: "",
    revenue: "",
    roasTarget: "3",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    create.mutate(
      {
        name: form.name,
        channel: form.channel,
        spend: form.spend ? Number(form.spend) : 0,
        revenue: form.revenue ? Number(form.revenue) : 0,
        roasTarget: Number(form.roasTarget),
      },
      {
        onSuccess: () => {
          setForm({ ...form, name: "", spend: "", revenue: "" });
          setShowForm(false);
        },
      },
    );
  }

  return (
    <div>
      <SectionTitle
        icon={<Activity className="h-4 w-4" />}
        title="RevOps · Neural Bidding & Governança LGPD"
        subtitle="ROAS consolidado, governança de campanhas e trilha de auditoria imutável."
        accent="purple"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="ROAS consolidado"
          value={`${(cStats?.roas ?? 0).toFixed(1)}x`}
          accent="green"
        />
        <Stat
          label="Investimento"
          value={`R$ ${(cStats?.spend ?? 0).toLocaleString("pt-BR", {
            maximumFractionDigits: 0,
          })}`}
          accent="white"
        />
        <Stat
          label="Campanhas ativas"
          value={String(cStats?.active ?? 0)}
          accent="cyan"
        />
        <Stat
          label="Alertas de compliance"
          value={String(aStats?.alerts ?? 0)}
          accent={aStats?.alerts ? "purple" : "green"}
        />
      </div>

      <div className="mb-4">
        <Btn onClick={() => setShowForm((s) => !s)} variant="ghost">
          <Plus className="h-3.5 w-3.5" /> Nova campanha
        </Btn>
      </div>

      {showForm && (
        <Panel className="mb-5 p-4">
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-5">
            <Field label="Nome">
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Campanha"
              />
            </Field>
            <Field label="Canal">
              <select
                className={inputCls}
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
              >
                {CHANNELS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Investimento (R$)">
              <input
                className={inputCls}
                type="number"
                value={form.spend}
                onChange={(e) => setForm({ ...form, spend: e.target.value })}
              />
            </Field>
            <Field label="Receita (R$)">
              <input
                className={inputCls}
                type="number"
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              />
            </Field>
            <Field label="ROAS alvo">
              <input
                className={inputCls}
                type="number"
                step="0.5"
                value={form.roasTarget}
                onChange={(e) =>
                  setForm({ ...form, roasTarget: e.target.value })
                }
              />
            </Field>
            <div className="md:col-span-5">
              <Btn type="submit" disabled={create.isPending}>
                {create.isPending ? "Salvando…" : "Adicionar campanha"}
              </Btn>
            </div>
          </form>
        </Panel>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="overflow-hidden">
          <div className="border-b border-[#1f242d] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#606d80]">
            Campanhas
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {campaigns.map((c) => {
              const roas = c.spend > 0 ? c.revenue / c.spend : 0;
              const hit = roas >= c.roasTarget;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between border-b border-[#1f242d]/50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-mono text-xs text-[#e0e6ed]">
                      {c.name}
                    </div>
                    <div className="font-mono text-[10px] text-[#606d80]">
                      {c.channel} · R$ {c.spend.toLocaleString("pt-BR")} invest.
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={hit ? "green" : "amber"}>
                      {roas.toFixed(1)}x
                    </Badge>
                    <button
                      onClick={() => remove.mutate({ id: c.id })}
                      className="text-[#606d80] hover:text-red-400"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
            {campaigns.length === 0 && (
              <div className="px-4 py-10 text-center font-mono text-[10px] text-[#3a4453]">
                Nenhuma campanha cadastrada.
              </div>
            )}
          </div>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#1f242d] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#606d80]">
            <ScrollText className="h-3.5 w-3.5" /> Trilha de auditoria (LGPD)
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {logs.map((l) => (
              <div
                key={l.id}
                className="border-b border-[#1f242d]/50 px-4 py-2.5 font-mono text-[11px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#00ff66]">{l.action}</span>
                  {l.complianceFlag !== "ok" && (
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  )}
                </div>
                <div className="text-[#e0e6ed]">{l.details}</div>
                <div className="text-[10px] text-[#3a4453]">
                  {l.actor} · {fmt(l.createdAt)}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="px-4 py-10 text-center font-mono text-[10px] text-[#3a4453]">
                Nenhum evento registrado.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
