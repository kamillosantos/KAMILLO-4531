import { Seo } from "../components/seo";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { Hero } from "../components/sections/hero";
import { Stats } from "../components/sections/stats";
import { Services } from "../components/sections/services";
import { Method } from "../components/sections/method";
import { Results } from "../components/sections/results";
import { About } from "../components/sections/about";
import { BlogPreview } from "../components/sections/blog-preview";
import { Faq } from "../components/sections/faq";
import { LeadForm } from "../components/sections/lead-form";
import { WhatsappFloat } from "../components/whatsapp-float";
import { ExitIntent } from "../components/exit-intent";
import { site } from "../lib/site";
import { services } from "../data/services";
import { faqs } from "../data/faq";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Assessoria de Marketing Digital",
    provider: { "@type": "Person", name: "Kamillo Santos", url: site.url },
    areaServed: "BR",
    description: site.defaultDescription,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Serviços de Marketing Digital",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.short },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function Index() {
  return (
    <>
      <Seo
        title="Assessoria de Marketing Digital | Kamillo Santos — Gestor de Tráfego Sênior"
        description={site.defaultDescription}
        path="/"
        jsonLd={jsonLd}
      />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Method />
        <Results />
        <About />
        <BlogPreview />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <WhatsappFloat />
      <ExitIntent />
    </>
  );
}
