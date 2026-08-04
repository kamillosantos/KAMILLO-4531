import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageCircle,
  Target,
  Gauge,
} from "lucide-react";
import { useCreateLead } from "../../queries/leads";
import { quizQuestions, computeResult, type QuizResult } from "../../data/quiz";
import { site } from "../../lib/site";

type Phase = "intro" | "questions" | "capture" | "result";

export function LeadQuiz({ articleTitle }: { articleTitle?: string }) {
  const createLead = useCreateLead();
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [lead, setLead] = useState({ name: "", contact: "" });
  const [result, setResult] = useState<QuizResult | null>(null);

  const total = quizQuestions.length;
  const current = quizQuestions[step];

  const pick = (score: number) => {
    const next = { ...answers, [current.id]: score };
    setAnswers(next);
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("capture");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createLead.isPending) return;
    const r = computeResult(answers);
    const summary = quizQuestions
      .map((q) => `${q.pillar}: ${answers[q.id] ?? 0}/3`)
      .join(" | ");
    createLead.mutate(
      {
        name: lead.name,
        contact: lead.contact,
        service: `Diagnóstico: ${r.priorityPillar}`,
        message: `[Quiz${articleTitle ? ` · ${articleTitle}` : ""}] Score ${r.scorePct}% (${r.level}). ${summary}`,
        source: "quiz-blog",
      },
      {
        onSuccess: () => {
          setResult(r);
          setPhase("result");
        },
      },
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden glow-primary my-12 not-prose">
      <div className="h-1 bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-full bg-gradient-to-r from-[#3b82f6] to-[#22d3ee] transition-all duration-500"
          style={{
            width:
              phase === "intro"
                ? "6%"
                : phase === "questions"
                  ? `${(step / total) * 80 + 6}%`
                  : phase === "capture"
                    ? "90%"
                    : "100%",
          }}
        />
      </div>

      <div className="p-7 md:p-9">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <Fade key="intro">
              <span className="chip">
                <Sparkles size={13} className="text-[#22d3ee]" /> Diagnóstico gratuito
              </span>
              <h3 className="mt-4 text-white font-extrabold text-[clamp(1.3rem,3vw,1.7rem)] leading-tight">
                Descubra onde seu marketing está{" "}
                <span className="text-gradient-blue">perdendo clientes</span>
              </h3>
              <p className="mt-3 text-[#a9b6d6] leading-relaxed">
                Responda 5 perguntas rápidas (menos de 1 minuto) e receba na hora um diagnóstico
                personalizado do seu marketing — mais um plano de ação sob medida no seu WhatsApp.
              </p>
              <button
                onClick={() => setPhase("questions")}
                className="btn-primary mt-6"
              >
                Começar diagnóstico <ArrowRight size={17} />
              </button>
            </Fade>
          )}

          {phase === "questions" && (
            <Fade key={`q-${step}`}>
              <div className="flex items-center justify-between text-[0.78rem] text-[#6f7fa3] font-semibold">
                <span className="uppercase tracking-wide text-[#22d3ee]">{current.pillar}</span>
                <span>
                  {step + 1} / {total}
                </span>
              </div>
              <h4 className="mt-3 text-white font-bold text-[1.2rem] leading-snug">
                {current.question}
              </h4>
              <div className="mt-5 space-y-2.5">
                {current.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => pick(opt.score)}
                    className="quiz-option"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight size={16} className="quiz-option-arrow" />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-5 inline-flex items-center gap-1.5 text-[#6f7fa3] text-sm hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
              )}
            </Fade>
          )}

          {phase === "capture" && (
            <Fade key="capture">
              <span className="chip">
                <Gauge size={13} className="text-[#22d3ee]" /> Quase lá
              </span>
              <h4 className="mt-4 text-white font-extrabold text-[1.4rem] leading-tight">
                Seu diagnóstico está pronto
              </h4>
              <p className="mt-2 text-[#a9b6d6]">
                Deixe seus dados para ver o resultado agora. O plano de ação detalhado chega no seu
                WhatsApp, sem custo.
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
                <button
                  type="submit"
                  disabled={createLead.isPending}
                  className="btn-primary w-full justify-center disabled:opacity-70"
                >
                  {createLead.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Gerando...
                    </>
                  ) : (
                    <>
                      Ver meu diagnóstico <ArrowRight size={17} />
                    </>
                  )}
                </button>
                <p className="text-[#5f6f92] text-[0.72rem] text-center">
                  Seus dados são usados apenas para o contato do diagnóstico.
                </p>
              </form>
            </Fade>
          )}

          {phase === "result" && result && (
            <Fade key="result">
              <div className="flex items-center gap-5">
                <ScoreRing pct={result.scorePct} color={result.levelColor} />
                <div>
                  <span
                    className="text-[0.78rem] font-bold uppercase tracking-wide"
                    style={{ color: result.levelColor }}
                  >
                    {result.level}
                  </span>
                  <h4 className="mt-1 text-white font-extrabold text-[1.3rem] leading-tight">
                    {result.headline}
                  </h4>
                </div>
              </div>

              <p className="mt-5 text-[#a9b6d6] leading-relaxed">{result.summary}</p>

              <div className="mt-5 rounded-xl bg-[rgba(59,130,246,0.09)] border border-[rgba(59,130,246,0.25)] p-5">
                <div className="flex items-center gap-2 text-[#60a5fa] font-semibold text-[0.85rem]">
                  <Target size={15} /> Sua maior oportunidade agora
                </div>
                <p className="mt-1 text-white font-bold">{result.priorityPillar}</p>
                <p className="mt-2 text-[#a9b6d6] text-[0.92rem] leading-relaxed">
                  {result.priorityAdvice}
                </p>
              </div>

              <p className="mt-5 text-[#a9b6d6] text-[0.92rem]">
                Prontinho, {lead.name.split(" ")[0]}! Seu plano de ação detalhado será enviado no seu
                WhatsApp. Quer agilizar? Fale comigo agora:
              </p>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
                style={{ background: "linear-gradient(100deg,#25d366,#1faf51)" }}
              >
                <MessageCircle size={18} /> Receber meu plano no WhatsApp
              </a>
            </Fade>
          )}
        </AnimatePresence>
      </div>
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

function ScoreRing({ pct, color }: { pct: number; color: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
      <svg width={84} height={84} className="-rotate-90">
        <circle cx={42} cy={42} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={7} />
        <motion.circle
          cx={42}
          cy={42}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-extrabold text-[1.15rem]">{pct}%</span>
      </div>
    </div>
  );
}
