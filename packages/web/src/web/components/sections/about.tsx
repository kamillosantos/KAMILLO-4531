import { BrainCircuit, LineChart, Layers } from "lucide-react";
import { Reveal } from "../reveal";
import { site } from "../../lib/site";

const highlights = [
  {
    icon: BrainCircuit,
    title: "Mentalidade de dados",
    desc: "Decisões baseadas em métricas de negócio — CPA, ROAS e LTV — e não em vaidade.",
  },
  {
    icon: LineChart,
    title: "Growth full-funnel",
    desc: "Do topo ao fundo do funil: atrair, converter e reter com consistência.",
  },
  {
    icon: Layers,
    title: "Visão de ecossistema",
    desc: "Tráfego, conteúdo e SEO integrados como um único sistema de aquisição.",
  },
];

export function About() {
  return (
    <section id="sobre" className="relative py-24 bg-[var(--bg-2)] border-y border-[var(--border)]">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          <Reveal>
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: "linear-gradient(135deg,#3b82f6,#22d3ee)" }}
              />
              <div className="glass relative rounded-3xl p-2.5 overflow-hidden">
                <img
                  src="/images/kamillo-santos.png"
                  alt="Kamillo Santos, especialista em tráfego pago e Google Partner oficial"
                  className="w-full rounded-2xl block"
                  loading="lazy"
                  width={1920}
                  height={1920}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <span className="eyebrow">Quem está por trás</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-white leading-tight">
              Sobre <span className="text-gradient-blue">Kamillo Santos</span>
            </h2>
            <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
              Sou gestor de tráfego sênior e especialista em marketing digital de resultados, com
              <strong className="text-white"> +10 anos de experiência</strong> e certificação
              <strong className="text-white"> Google Partner</strong>. Meu trabalho é transformar
              orçamento de mídia e presença online em um canal previsível de aquisição de clientes —
              unindo estratégia, tráfego pago, gestão de mídias sociais, pesquisa de mercado e
              otimização de sites.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((h) => (
                <div key={h.title} className="rounded-xl border border-[var(--border)] bg-[rgba(96,165,250,0.05)] p-5">
                  <h.icon size={22} className="text-[#22d3ee]" />
                  <h4 className="mt-3 text-white font-semibold text-[0.98rem]">{h.title}</h4>
                  <p className="mt-1.5 text-[#93a2c4] text-[0.85rem] leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-8"
            >
              Conversar com Kamillo
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
