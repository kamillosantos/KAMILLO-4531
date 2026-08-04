import {
  Compass,
  Target,
  Share2,
  Search,
  Gauge,
  Rocket,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "../reveal";
import { services } from "../../data/services";
import { site } from "../../lib/site";

const icons: Record<string, LucideIcon> = {
  compass: Compass,
  target: Target,
  share2: Share2,
  search: Search,
  gauge: Gauge,
  rocket: Rocket,
};

const accentColor: Record<string, string> = {
  blue: "#3b82f6",
  cyan: "#22d3ee",
  violet: "#8b5cf6",
};

export function Services() {
  return (
    <section id="servicos" className="relative py-24">
      <div className="container-x">
        <Reveal className="max-w-2xl mb-14">
          <span className="eyebrow">O que eu faço por você</span>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-white leading-tight">
            Um ecossistema completo de <span className="text-gradient-blue">aquisição</span>
          </h2>
          <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
            Cada serviço é uma engrenagem da mesma máquina: atrair, converter e escalar clientes
            com previsibilidade — não com sorte.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            const color = accentColor[s.accent];
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <article
                  className="glass card-hover rounded-2xl p-7 h-full flex flex-col"
                  style={{ borderTop: `3px solid ${color}` }}
                >
                  <div
                    className="grid place-items-center w-12 h-12 rounded-xl mb-5"
                    style={{ background: `${color}1f`, border: `1px solid ${color}55` }}
                  >
                    <Icon size={23} style={{ color }} />
                  </div>
                  <h3 className="text-[1.25rem] font-bold text-white">{s.title}</h3>
                  <p className="mt-2.5 text-[#93a2c4] text-[0.95rem] leading-relaxed">{s.short}</p>
                  <ul className="mt-5 space-y-2.5 list-none p-0 flex-1">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-[#c6d2ec] text-[0.9rem]">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: color }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold no-underline"
                    style={{ color }}
                  >
                    Quero esse serviço <ArrowRight size={15} />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
