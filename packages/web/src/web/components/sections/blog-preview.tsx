import { Link } from "wouter";
import { ArrowRight, Clock } from "lucide-react";
import { Reveal } from "../reveal";
import { posts } from "../../data/posts";

export function BlogPreview() {
  const latest = posts.slice(0, 3);
  return (
    <section id="blog" className="relative py-24">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="eyebrow">Conteúdo & SEO</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-white leading-tight">
              Portal de <span className="text-gradient-blue">inteligência</span> em marketing
            </h2>
            <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
              Um cluster de conteúdo que responde às principais dúvidas do nicho — construído para
              ranquear e para te ajudar a decidir melhor.
            </p>
          </div>
          <Link to="/blog" className="btn-ghost">
            Ver todos os artigos <ArrowRight size={16} />
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {latest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                to={`/blog/${p.slug}`}
                className="glass card-hover rounded-2xl p-7 h-full flex flex-col no-underline"
              >
                <span className="chip self-start">{p.category}</span>
                <h3 className="mt-4 text-[1.2rem] font-bold text-white leading-snug">{p.title}</h3>
                <p className="mt-3 text-[#93a2c4] text-[0.92rem] leading-relaxed flex-1">
                  {p.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#6f7fa3] text-[0.82rem]">
                    <Clock size={14} /> {p.readingTime} min
                  </span>
                  <span className="flex items-center gap-1.5 text-[#60a5fa] font-semibold text-[0.88rem]">
                    Ler artigo <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
