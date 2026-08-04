export type Service = {
  slug: string;
  icon: string; // lucide icon name key mapped in component
  title: string;
  keyword: string;
  short: string;
  bullets: string[];
  accent: "blue" | "cyan" | "violet";
};

export const services: Service[] = [
  {
    slug: "assessoria-de-marketing",
    icon: "compass",
    title: "Assessoria de Marketing",
    keyword: "assessoria de marketing digital",
    short:
      "Direção estratégica contínua para transformar sua marca em uma máquina previsível de aquisição de clientes.",
    bullets: [
      "Diagnóstico completo do funil e do posicionamento",
      "Plano de crescimento com metas e KPIs claros",
      "Acompanhamento próximo e relatórios de performance",
    ],
    accent: "blue",
  },
  {
    slug: "estrategias-de-marketing",
    icon: "target",
    title: "Estratégias & Planejamento",
    keyword: "estratégia de marketing",
    short:
      "Planejamento orientado a dados: posicionamento, oferta e jornada desenhados para escala sustentável.",
    bullets: [
      "Definição de ICP e proposta de valor",
      "Arquitetura de funil e jornada de compra",
      "Roadmap trimestral com prioridades de impacto",
    ],
    accent: "cyan",
  },
  {
    slug: "gestao-de-midias-sociais",
    icon: "share2",
    title: "Gestão de Mídias Sociais",
    keyword: "gestão de mídias sociais",
    short:
      "Presença consistente e conteúdo que gera autoridade e demanda no Instagram, Facebook, TikTok e LinkedIn.",
    bullets: [
      "Calendário editorial e produção de conteúdo",
      "Gestão de comunidade e engajamento",
      "Conteúdo alinhado à intenção de busca",
    ],
    accent: "violet",
  },
  {
    slug: "pesquisa-de-mercado",
    icon: "search",
    title: "Pesquisa de Mercado",
    keyword: "pesquisa de mercado",
    short:
      "Inteligência competitiva e análise de audiência para tomar decisões com base em dados, não em achismo.",
    bullets: [
      "Análise de concorrência e benchmarks",
      "Mapeamento de personas e dores reais",
      "Validação de oferta e precificação",
    ],
    accent: "blue",
  },
  {
    slug: "otimizacao-de-sites-seo",
    icon: "gauge",
    title: "Otimização de Sites (SEO)",
    keyword: "otimização de sites SEO",
    short:
      "SEO técnico e semântico para você ser encontrado por quem digita qualquer termo do seu nicho no Google.",
    bullets: [
      "SEO técnico, Core Web Vitals e performance",
      "Cluster de conteúdo e SEO semântico",
      "Dados estruturados (Schema) e indexação",
    ],
    accent: "cyan",
  },
  {
    slug: "trafego-pago",
    icon: "rocket",
    title: "Tráfego Pago",
    keyword: "tráfego pago",
    short:
      "Campanhas de Google Ads e Meta Ads com foco em CPA mínimo, ROAS previsível e escala saudável.",
    bullets: [
      "Estruturação de campanhas de alta performance",
      "Otimização de lances e criativos por dados",
      "Remarketing e rastreamento server-side",
    ],
    accent: "violet",
  },
];
