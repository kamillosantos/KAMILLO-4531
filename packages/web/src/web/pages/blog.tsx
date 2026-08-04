import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock, ArrowLeft } from "lucide-react";
import { Seo } from "../components/seo";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { WhatsappFloat } from "../components/whatsapp-float";
import { Reveal } from "../components/reveal";
import { posts, categories } from "../data/posts";
import { site } from "../lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Kamillo Santos — Marketing Digital",
  url: `${site.url}/blog`,
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    url: `${site.url}/blog/${p.slug}`,
    author: { "@type": "Person", name: "Kamillo Santos" },
  })),
};

export default function BlogPage() {
  const [active, setActive] = useState<string>("Todos");
  const filters = ["Todos", ...categories];
  const visible = active === "Todos" ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      <Seo
        title="Blog de Marketing Digital | Kamillo Santos — Tráfego, SEO e Growth"
        description="Artigos sobre assessoria de marketing digital, tráfego pago, gestão de mídias sociais, SEO e pesquisa de mercado. Conteúdo de um gestor de tráfego sênior."
        path="/blog"
        keywords={[
          "blog marketing digital",
          "artigos tráfego pago",
          "SEO",
          "gestão de mídias sociais",
          "Kamillo Santos",
        ]}
        jsonLd={jsonLd}
      />
      <Header />
      <main className="pt-28 pb-24 bg-mesh min-h-screen">
        <div className="container-x">
          <Reveal className="max-w-2xl mb-14">
            <Link to="/" className="inline-flex items-center gap-1.5 text-[#60a5fa] text-sm no-underline mb-6">
              <ArrowLeft size={15} /> Voltar ao início
            </Link>
            <span className="eyebrow">Portal de conteúdo</span>
            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-extrabold text-white leading-tight">
              Blog de <span className="text-gradient-blue">Marketing Digital</span>
            </h1>
            <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
              Cluster de conteúdo do nicho: tráfego pago, SEO, mídias sociais, pesquisa de mercado e
              estratégia — para você decidir com base em dados.
            </p>
          </Reveal>

          <Reveal className="mb-10 flex flex-wrap gap-2.5">
            {filters.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-2 text-[0.85rem] font-semibold transition-colors ${
                  active === c
                    ? "border-[#60a5fa] bg-[#60a5fa]/15 text-[#bfdbfe]"
                    : "border-white/10 bg-white/[0.03] text-[#93a2c4] hover:border-white/25 hover:text-white"
                }`}
              >
                {c}
                {c !== "Todos" && (
                  <span className="ml-1.5 text-[#6f7fa3]">
                    {posts.filter((p) => p.category === c).length}
                  </span>
                )}
              </button>
            ))}
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="glass card-hover rounded-2xl p-7 h-full flex flex-col no-underline"
                >
                  <span className="chip self-start">{p.category}</span>
                  <h2 className="mt-4 text-[1.2rem] font-bold text-white leading-snug">{p.title}</h2>
                  <p className="mt-3 text-[#93a2c4] text-[0.92rem] leading-relaxed flex-1">
                    {p.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#6f7fa3] text-[0.82rem]">
                      <Clock size={14} /> {p.readingTime} min de leitura
                    </span>
                    <span className="flex items-center gap-1.5 text-[#60a5fa] font-semibold text-[0.88rem]">
                      Ler <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappFloat />
    </>
  );
}
