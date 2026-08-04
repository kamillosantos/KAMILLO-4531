import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Radar,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageCircle,
  Lightbulb,
  Layers,
  Database,
  Target,
  Zap,
} from "lucide-react";
import { useCreateLead } from "../../queries/leads";
import {
  generateBlueprint,
  ticketOptions,
  trafficOptions,
  type Blueprint,
  type TicketTier,
  type TrafficLevel,
} from "../../data/garimpo";
import { site } from "../../lib/site";

type Phase = "intro" | "niche" | "ticket" | "traffic" | "capture" | "result";

export function GarimpoTool() {
  const createLead = useCreateLead();
  const [phase, setPhase] = useState<Phase>("intro");
  const [niche, setNiche] = useState("");
  const [ticket, setTicket] = useState<TicketTier | null>(null);
  const [traffic, setTraffic] = useState<TrafficLevel | null>(null);
  const [lead, setLead] = useState({ name: "", contact: "" });
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  const progress: Record<Phase, string> = {
    intro: "6%",
    niche: "24%",
    ticket: "44%",
    traffic: "64%",
    capture: "86%",
    result: "100%",
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createLead.isPending || !ticket || !traffic) return;
    const bp = generateBlueprint({ niche, ticket, traffic });
    const tierLabel = ticketOptions.find((t) => t.value === ticket)?.label ?? ticket;
    const trafficLabel = trafficOptions.find((t) => t.value === traffic)?.label ?? traffic;
    createLead.mutate(
      {
        name: lead.name,
        contact: lead.contact,
        service: `Garimpo · ${tierLabel}`,
        message: `[Ferramenta Garimpo] Nicho: "${niche}" | Ticket: ${tierLabel} | Tráfego: ${trafficLabel} | Mecanismo sugerido: ${bp.mechanismName} | Prontidão: ${bp.scaleReadiness}%`,
        source: "garimpo",
      },
      {
        onSuccess: () => {
          setBlueprint(bp);
          setPhase("result");
        },
      },
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden glow-primary not-prose">
      <div className="h-1 bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] transition-all duration-500"
          style={{ width: progress[phase] }}
        />
      </div>

      <div className="p-7 md:p-10">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <Fade key="intro">
              <span className="chip">
                <Radar size={13} className="text-[#22d3ee]" /> #KamilloSantosProtocol
              </span>
              <h3 className="mt-4 text-white font-extrabold text-[clamp(1.4rem,3.2vw,2rem)] leading-tight">
                Ferramenta de <span className="text-gradient-blue">Garimpo</span> de Funil
              </h3>
              <p className="mt-3 text-[#a9b6d6] leading-relaxed max-w-2xl">
                Nada de criar no escuro. Diga o seu nicho e o seu ticket, e o motor do
                #KamilloSantosProtocol devolve na hora um blueprint de funil Max Performance —
                Big Idea, mecanismo único, escada de valor e stack de rastreamento server-side.
              </p>
              <button onClick={() => setPhase("niche")} className="btn-primary mt-6">
                Garimpar meu funil <ArrowRight size={17} />
              </button>
            </Fade>
          )}

          {phase === "niche" && (
            <Fade key="niche">
              <StepHead step={1} label="Seu mercado" />
              <h4 className="mt-3 text-white font-bold text-[1.25rem] leading-snug">
                Qual é o seu nicho ou produto?
              </h4>
              <p className="mt-2 text-[#8595ba] text-[0.92rem]">
                Ex: "emagrecimento feminino", "consultoria financeira", "curso de inglês".
              </p>
              <input
                autoFocus
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && niche.trim().length > 1 && setPhase("ticket")}
                placeholder="Digite seu nicho ou produto"
                className="quiz-input mt-4"
              />
              <div className="mt-5 flex items-center gap-3">
                <button
                  disabled={niche.trim().length < 2}
                  onClick={() => setPhase("ticket")}
                  className="btn-primary disabled:opacity-40"
                >
                  Continuar <ArrowRight size={16} />
                </button>
                <BackBtn onClick={() => setPhase("intro")} />
              </div>
            </Fade>
          )}

          {phase === "ticket" && (
            <Fade key="ticket">
              <StepHead step={2} label="Modelo de oferta" />
              <h4 className="mt-3 text-white font-bold text-[1.25rem] leading-snug">
                Qual o ticket da sua oferta?
              </h4>
              <div className="mt-5 grid sm:grid-cols-2 gap-2.5">
                {ticketOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTicket(opt.value);
                      setPhase("traffic");
                    }}
                    className={`quiz-option flex-col !items-start gap-0.5 ${ticket === opt.value ? "!border-[#3b82f6] !bg-[rgba(59,130,246,0.12)]" : ""}`}
                  >
                    <span className="font-semibold text-white">{opt.label}</span>
                    <span className="text-[#8595ba] text-[0.82rem]">{opt.hint}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <BackBtn onClick={() => setPhase("niche")} />
              </div>
            </Fade>
          )}

          {phase === "traffic" && (
            <Fade key="traffic">
              <StepHead step={3} label="Maturidade de tráfego" />
              <h4 className="mt-3 text-white font-bold text-[1.25rem] leading-snug">
                Como está seu tráfego pago hoje?
              </h4>
              <div className="mt-5 space-y-2.5">
                {trafficOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTraffic(opt.value);
                      setPhase("capture");
                    }}
                    className="quiz-option"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight size={16} className="quiz-option-arrow" />
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <BackBtn onClick={() => setPhase("ticket")} />
              </div>
            </Fade>
          )}

          {phase === "capture" && (
            <Fade key="capture">
              <StepHead step={4} label="Quase lá" />
              <h4 className="mt-3 text-white font-extrabold text-[1.4rem] leading-tight">
                Seu blueprint está pronto
              </h4>
              <p className="mt-2 text-[#a9b6d6]">
                Deixe seus dados para ver o blueprint agora. A arquitetura completa do funil (com
                copy, VSL e campanha) é detalhada com o Kamillo pelo WhatsApp.
              </p>
              <form onSubmit={submit} className="mt-5 space-y-3">
                <input
                  required
                  minLength={2}
                  value={lead.name}
                  onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                  placeholder="Seu nome"
                  className="quiz-input"
                />
                <input
                  required
                  minLength={3}
                  value={lead.contact}
                  onChange={(e) => setLead((l) => ({ ...l, contact: e.target.value }))}
                  placeholder="WhatsApp ou e-mail"
                  className="quiz-input"
                />
                {createLead.isError && (
                  <p className="text-[#f87171] text-sm">
                    Algo deu errado. Tente novamente ou fale no WhatsApp.
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={createLead.isPending}
                    className="btn-primary disabled:opacity-70"
                  >
                    {createLead.isPending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Garimpando...
                      </>
                    ) : (
                      <>
                        Ver meu blueprint <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                  <BackBtn onClick={() => setPhase("traffic")} />
                </div>
                <p className="text-[#5f6f92] text-[0.72rem]">
                  Seus dados são usados apenas para o contato do diagnóstico.
                </p>
              </form>
            </Fade>
          )}

          {phase === "result" && blueprint && (
            <Fade key="result">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[#22d3ee] text-[0.78rem] font-bold uppercase tracking-wide">
                    Blueprint Max Performance
                  </span>
                  <h4 className="mt-1 text-white font-extrabold text-[1.4rem] leading-tight">
                    {blueprint.mechanismName}
                  </h4>
                </div>
                <ScoreRing pct={blueprint.scaleReadiness} />
              </div>

              <Block icon={<Lightbulb size={16} />} title="Big Idea">
                <p>{blueprint.bigIdea}</p>
              </Block>

              <Block icon={<Zap size={16} />} title="Mecanismo único (3 passos)">
                <ol className="space-y-2 list-none m-0 p-0">
                  {blueprint.mechanismSteps.map((s, i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-[rgba(59,130,246,0.2)] text-[#60a5fa] text-[0.72rem] font-bold">
                        {i + 1}
                      </span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              <Block icon={<Layers size={16} />} title="Escada de valor sugerida">
                <div className="space-y-1.5">
                  {blueprint.funnel.map((f) => (
                    <div
                      key={f.stage}
                      className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 rounded-lg bg-[rgba(4,6,15,0.5)] border border-[var(--border)] px-3.5 py-2.5"
                    >
                      <span className="text-white font-semibold text-[0.92rem]">{f.stage}</span>
                      <span className="text-[#22d3ee] font-semibold text-[0.85rem]">{f.price}</span>
                      <span className="text-[#8595ba] text-[0.82rem] basis-full">{f.role}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[#a9b6d6] text-[0.9rem]">{blueprint.offerAngle}</p>
              </Block>

              <Block icon={<Database size={16} />} title="Stack de rastreamento (engenharia de dados)">
                <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
                  {blueprint.trackingStack.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.25)] px-3 py-1 text-[#a9e9f5] text-[0.78rem]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </Block>

              <div className="mt-5 rounded-xl bg-[rgba(59,130,246,0.09)] border border-[rgba(59,130,246,0.25)] p-5">
                <div className="flex items-center gap-2 text-[#60a5fa] font-semibold text-[0.85rem]">
                  <Target size={15} /> Seu próximo movimento
                </div>
                <p className="mt-2 text-[#dbe4fb] text-[0.94rem] leading-relaxed">
                  {blueprint.priorityMove}
                </p>
              </div>

              <p className="mt-5 text-[#a9b6d6] text-[0.92rem]">
                {lead.name.split(" ")[0]}, esse é o esqueleto. A execução completa — copy da VSL,
                página de vendas, criativos e campanha Meta Ads com tracking server-side — a gente
                monta junto:
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
                style={{ background: "linear-gradient(100deg,#25d366,#1faf51)" }}
              >
                <MessageCircle size={18} /> Montar meu funil com o Kamillo
              </a>
            </Fade>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepHead({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center justify-between text-[0.78rem] font-semibold">
      <span className="uppercase tracking-wide text-[#22d3ee]">{label}</span>
      <span className="text-[#6f7fa3]">Etapa {step} / 4</span>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center gap-1.5 text-[#6f7fa3] text-sm hover:text-white transition-colors"
    >
      <ArrowLeft size={14} /> Voltar
    </button>
  );
}

function Block({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 text-white font-bold text-[1rem]">
        <span className="text-[#60a5fa]">{icon}</span> {title}
      </div>
      <div className="mt-2.5 text-[#a9b6d6] text-[0.94rem] leading-relaxed">{children}</div>
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      {children}
    </motion.div>
  );
}

function ScoreRing({ pct }: { pct: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct < 40 ? "#f87171" : pct < 70 ? "#fbbf24" : "#22d3ee";
  return (
    <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
      <svg width={76} height={76} className="-rotate-90">
        <circle cx={38} cy={38} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
        <motion.circle
          cx={38}
          cy={38}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-white font-extrabold text-[1rem]">{pct}%</span>
        <span className="text-[#6f7fa3] text-[0.6rem] mt-0.5">pronto</span>
      </div>
    </div>
  );
}
