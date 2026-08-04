import { Link } from "wouter";
import { ArrowLeft, Radar, ShieldCheck, Cpu, TrendingUp } from "lucide-react";
import { Seo } from "../components/seo";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { WhatsappFloat } from "../components/whatsapp-float";
import { Reveal } from "../components/reveal";
import { GarimpoTool } from "../components/garimpo/garimpo-tool";
import { site } from "../lib/site";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ferramenta de Garimpo de Funil — #KamilloSantosProtocol",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${site.url}/garimpo`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    description:
      "Ferramenta gratuita que gera um blueprint de funil de alta performance a partir do seu nicho e ticket: Big Idea, mecanismo único, escada de valor e stack de rastreamento server-side.",
    author: { "@type": "Person", name: "Kamillo Santos" },
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como garimpar e estruturar um funil Max Performance",
    step: [
      { "@type": "HowToStep", name: "Garimpo", text: "Validar ofertas ativas há mais de 90 dias no nicho." },
      { "@type": "HowToStep", name: "Recomposição autoral", text: "Recriar o mecanismo único com terminologia proprietária." },
      { "@type": "HowToStep", name: "Engenharia de dados", text: "Taguear com UTMs e CAPI server-side para atribuição correta." },
    ],
  },
];

const pillars = [
  { icon: Radar, title: "Garimpo de ofertas", text: "Modela o que já vende no tráfego — nada de criar no escuro." },
  { icon: Cpu, title: "Engenharia de dados", text: "UTMs, CAPI e server-side tracking para atribuição correta." },
  { icon: TrendingUp, title: "Escada de valor", text: "Tripwire, order bumps e upsells 1-clique para elevar o AOV." },
  { icon: ShieldCheck, title: "Oferta Grand Slam", text: "Ancoragem de preço e inversão total de risco." },
];

export default function GarimpoPage() {
  return (
    <>
      <Seo
        title="Ferramenta de Garimpo de Funil | Max Performance — Kamillo Santos"
        description="Gere um blueprint de funil de alta performance em segundos: Big Idea, mecanismo único, escada de valor e rastreamento server-side. Motor do #KamilloSantosProtocol para tráfego pago."
        path="/garimpo"
        keywords={[
          "garimpo de ofertas",
          "estrutura de funil de vendas",
          "tráfego pago max performance",
          "engenharia de dados marketing",
          "server-side tracking",
          "#KamilloSantosProtocol",
        ]}
        jsonLd={jsonLd}
      />
      <Header />
      <main className="pt-28 pb-24">
        <div className="container-x max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[#60a5fa] text-sm no-underline mb-6"
          >
            <ArrowLeft size={15} /> Voltar ao início
          </Link>

          <Reveal>
            <span className="chip">
              <Radar size={13} className="text-[#22d3ee]" /> Ferramenta gratuita
            </span>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-extrabold text-white leading-[1.05]">
              Descubra o <span className="text-gradient-blue">funil ideal</span> pro seu produto —
              em segundos
            </h1>
            <p className="mt-4 text-[#a9b6d6] text-[1.05rem] leading-relaxed">
              O motor de Garimpo do #KamilloSantosProtocol transforma seu nicho e ticket num
              blueprint acionável de aquisição: da Big Idea ao rastreamento server-side.
            </p>
          </Reveal>

          <div className="mt-8">
            <Reveal delay={0.1}>
              <GarimpoTool />
            </Reveal>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.05 * i}>
                <div className="glass card-hover rounded-xl p-5 h-full">
                  <p.icon size={22} className="text-[#22d3ee]" />
                  <h3 className="mt-3 text-white font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-[#8595ba] text-[0.9rem] leading-relaxed">{p.text}</p>
                </div>
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
