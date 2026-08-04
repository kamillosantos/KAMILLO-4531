import { useState } from "react";
import { Zap, Plus, Webhook } from "lucide-react";
import {
  useCheckouts,
  useCheckoutStats,
  useCheckoutCreate,
} from "../../queries/painel";
import { Panel, Stat, Field, inputCls, Btn, Badge, SectionTitle } from "./ui";

const GATEWAYS = [
  "Hotmart",
  "Kiwify",
  "ClickBank",
  "BuyGoods",
  "Eduzz",
  "Monetizze",
];

const OFFERS = [
  { id: "tripwire", label: "Tripwire" },
  { id: "main", label: "Oferta principal" },
  { id: "order_bump", label: "Order bump" },
  { id: "upsell", label: "Upsell" },
  { id: "downsell", label: "Downsell" },
];

const offerTone: Record<string, "green" | "cyan" | "amber" | "muted"> = {
  tripwire: "amber",
  main: "cyan",
  order_bump: "green",
  upsell: "green",
  downsell: "muted",
};

export function B2CFunnel() {
  const { data: rows = [] } = useCheckouts();
  const { data: stats } = useCheckoutStats();
  const create = useCheckoutCreate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    gateway: "Hotmart",
    product: "",
    offerType: "main",
    amount: "",
    buyerName: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.product || !form.amount) return;
    create.mutate(
      {
        gateway: form.gateway as "Hotmart",
        product: form.product,
        offerType: form.offerType as "main",
        amount: Number(form.amount),
        buyerName: form.buyerName || undefined,
      },
      {
        onSuccess: () => {
          setForm({ ...form, product: "", amount: "", buyerName: "" });
          setShowForm(false);
        },
      },
    );
  }

  return (
    <div>
      <SectionTitle
        icon={<Zap className="h-4 w-4" />}
        title="101X Funnel · Infoproduct Engine (B2C)"
        subtitle="Ledger de checkouts multi-gateway — tripwire, bumps, upsells e maximização de AOV."
        accent="purple"
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Receita aprovada"
          value={`R$ ${(stats?.revenue ?? 0).toLocaleString("pt-BR", {
            maximumFractionDigits: 0,
          })}`}
          accent="green"
        />
        <Stat label="Vendas aprovadas" value={String(stats?.approved ?? 0)} accent="cyan" />
        <Stat
          label="Ticket médio (AOV)"
          value={`R$ ${(stats?.aov ?? 0).toLocaleString("pt-BR", {
            maximumFractionDigits: 0,
          })}`}
          accent="white"
        />
        <Stat
          label="Order bumps + upsells"
          value={String(
            (stats?.byOffer?.order_bump ?? 0) + (stats?.byOffer?.upsell ?? 0),
          )}
          accent="purple"
        />
      </div>

      <Panel className="mb-5 p-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#00f0ff]">
          <Webhook className="h-4 w-4" /> Endpoints de webhook (ativos)
        </div>
        <div className="flex flex-wrap gap-2">
          {GATEWAYS.map((g) => (
            <code
              key={g}
              className="rounded border border-[#1f242d] bg-[#050505] px-2 py-1 font-mono text-[10px] text-[#606d80]"
            >
              POST /api/webhooks/{g.toLowerCase()}
            </code>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] text-[#3a4453]">
          Cada gateway envia eventos de compra (idempotentes via
          x-idempotency-key). Registros aparecem no ledger abaixo em tempo real.
        </p>
      </Panel>

      <div className="mb-4">
        <Btn onClick={() => setShowForm((s) => !s)} variant="ghost">
          <Plus className="h-3.5 w-3.5" /> Registrar checkout manual
        </Btn>
      </div>

      {showForm && (
        <Panel className="mb-5 p-4">
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-5">
            <Field label="Gateway">
              <select
                className={inputCls}
                value={form.gateway}
                onChange={(e) => setForm({ ...form, gateway: e.target.value })}
              >
                {GATEWAYS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Produto">
              <input
                className={inputCls}
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                placeholder="Nome do produto"
              />
            </Field>
            <Field label="Tipo de oferta">
              <select
                className={inputCls}
                value={form.offerType}
                onChange={(e) =>
                  setForm({ ...form, offerType: e.target.value })
                }
              >
                {OFFERS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Valor (R$)">
              <input
                className={inputCls}
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
              />
            </Field>
            <Field label="Comprador">
              <input
                className={inputCls}
                value={form.buyerName}
                onChange={(e) =>
                  setForm({ ...form, buyerName: e.target.value })
                }
                placeholder="opcional"
              />
            </Field>
            <div className="md:col-span-5">
              <Btn type="submit" disabled={create.isPending}>
                {create.isPending ? "Salvando…" : "Registrar venda"}
              </Btn>
            </div>
          </form>
        </Panel>
      )}

      <Panel className="overflow-hidden">
        <div className="border-b border-[#1f242d] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[#606d80]">
          Ledger de checkouts
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full font-mono text-[11px]">
            <thead className="text-[#606d80]">
              <tr className="border-b border-[#1f242d] text-left">
                <th className="px-4 py-2 font-normal">Gateway</th>
                <th className="px-4 py-2 font-normal">Produto</th>
                <th className="px-4 py-2 font-normal">Oferta</th>
                <th className="px-4 py-2 font-normal">Valor</th>
                <th className="px-4 py-2 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[#1f242d]/50">
                  <td className="px-4 py-2 text-[#e0e6ed]">{r.gateway}</td>
                  <td className="px-4 py-2 text-[#e0e6ed]">{r.product}</td>
                  <td className="px-4 py-2">
                    <Badge tone={offerTone[r.offerType] ?? "muted"}>
                      {r.offerType}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-[#00ff66]">
                    R$ {r.amount.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">
                    <Badge tone={r.status === "approved" ? "green" : "amber"}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-[#3a4453]"
                  >
                    Nenhum checkout registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
