import { CheckCircle2, BadgeCheck } from "lucide-react";
import { Reveal } from "../reveal";
import { site } from "../../lib/site";

const pillars = [
  "Decisões guiadas por dados, não por achismo",
  "Rastreamento confiável de cada conversão",
  "Foco em CPA baixo e ROAS previsível",
  "Relatórios claros — você sempre sabe o retorno",
];

const testimonials = [
  { id: "2rPJ5f93N7E", label: "Depoimento de cliente" },
  { id: "t0dkjF2dcyg", label: "Depoimento de cliente" },
  { id: "NbhifcyVFsU", label: "Depoimento de cliente" },
];

export function Results() {
  return (
    <section id="resultados" className="relative py-24">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] items-center">
          <Reveal>
            <span className="eyebrow">Por que funciona</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-white leading-tight">
              Resultado é <span className="text-gradient-blue">consequência</span> de método
            </h2>
            <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
              Marketing que dá certo não é sorte — é engenharia. Como <strong className="text-white">Google
              Partner</strong>, cada real investido é medido, otimizado e conectado a uma meta de negócio.
            </p>
            <ul className="mt-7 space-y-3.5 list-none p-0">
              {pillars.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[#e2e8f5] text-[0.98rem]">
                  <CheckCircle2 size={20} className="text-[#22d3ee] shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8"
            >
              Quero esses resultados
            </a>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="glass rounded-2xl p-6 relative glow-primary">
              <div className="flex items-center gap-2 mb-5">
                <BadgeCheck size={20} className="text-[#22d3ee]" />
                <span className="text-white font-semibold text-[0.95rem]">
                  Depoimentos reais de clientes
                </span>
              </div>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl overflow-hidden border border-[var(--border)] bg-black/40"
                  >
                    <div className="relative w-full" style={{ aspectRatio: "9 / 16" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${t.id}`}
                        title={t.label}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[#6f7fa3] text-[0.82rem] text-center">
                Clientes atendidos pela assessoria de Kamillo Santos.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
