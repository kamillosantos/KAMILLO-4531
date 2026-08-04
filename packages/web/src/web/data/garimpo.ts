// #KamilloSantosProtocol — motor de "Garimpo" simplificado.
// Gera um blueprint de funil personalizado a partir de inputs simples do lead.
// Determinístico (sem IA em runtime) — a análise completa é entregue pelo Kamillo.

export type TicketTier = "low" | "mid" | "high" | "servico";
export type TrafficLevel = "zero" | "some" | "scaling";

export type GarimpoInput = {
  niche: string;
  ticket: TicketTier;
  traffic: TrafficLevel;
};

export type FunnelStage = {
  stage: string;
  price: string;
  role: string;
};

export type Blueprint = {
  bigIdea: string;
  mechanismName: string;
  mechanismSteps: string[];
  funnel: FunnelStage[];
  trackingStack: string[];
  scaleReadiness: number; // 0-100
  priorityMove: string;
  offerAngle: string;
};

export const ticketOptions: { value: TicketTier; label: string; hint: string }[] = [
  { value: "low", label: "Low-ticket / infoproduto", hint: "R$ 9 a R$ 197" },
  { value: "mid", label: "Mid-ticket / curso", hint: "R$ 197 a R$ 997" },
  { value: "high", label: "High-ticket / mentoria", hint: "Acima de R$ 997" },
  { value: "servico", label: "Serviço / B2B", hint: "Proposta sob medida" },
];

export const trafficOptions: { value: TrafficLevel; label: string }[] = [
  { value: "zero", label: "Ainda não rodo tráfego pago" },
  { value: "some", label: "Rodo, mas o retorno é instável" },
  { value: "scaling", label: "Já escalo e quero otimizar" },
];

function cleanNiche(niche: string): string {
  const n = niche.trim().replace(/\s+/g, " ");
  return n.length ? n : "seu mercado";
}

function acronymFrom(niche: string): string {
  const words = cleanNiche(niche)
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 3);
  const base = words.map((w) => w[0]?.toUpperCase()).join("");
  return base.length >= 2 ? base : "MAX";
}

const funnelByTier: Record<TicketTier, FunnelStage[]> = {
  low: [
    { stage: "Tripwire (entrada)", price: "R$ 9,90 – R$ 19,90", role: "Financia o clique e busca CAC zero na entrada" },
    { stage: "Order Bump 1", price: "R$ 29,90", role: "Kit de implementação rápida — eleva o AOV sem atrito" },
    { stage: "Order Bump 2", price: "R$ 47,00", role: "Templates / aceleradores visuais" },
    { stage: "Upsell 1-clique", price: "R$ 97,00", role: "Automação / escala do resultado" },
    { stage: "Upsell 2", price: "R$ 297,00", role: "Mentoria / comunidade de alta performance" },
  ],
  mid: [
    { stage: "Isca / VSL", price: "Gratuito", role: "Captura e aquece com prova de mecanismo" },
    { stage: "Core (curso)", price: "R$ 297 – R$ 997", role: "Oferta principal ancorada em transformação" },
    { stage: "Order Bump", price: "R$ 97,00", role: "Implementação assistida / templates" },
    { stage: "Upsell 1-clique", price: "R$ 497,00", role: "Aprofundamento ou acesso estendido" },
    { stage: "Downsell", price: "Parcelado", role: "Recupera quem não converteu no pico" },
  ],
  high: [
    { stage: "VSL cinematográfica", price: "Gratuito", role: "Hook → história → mecanismo → projeção de status" },
    { stage: "Aplicação (qualificação)", price: "Gratuito", role: "Filtra lead quente e coleta first-party data" },
    { stage: "Call de fechamento", price: "R$ 997 – R$ 5.000+", role: "Oferta Grand Slam com inversão total de risco" },
    { stage: "Order bump de bônus", price: "Add-on", role: "Aumenta valor percebido no fechamento" },
    { stage: "Continuidade / recorrência", price: "Mensal", role: "LTV: comunidade ou acompanhamento" },
  ],
  servico: [
    { stage: "Lead magnet / diagnóstico", price: "Gratuito", role: "Captura qualificada com dor mapeada" },
    { stage: "Reunião de proposta", price: "Gratuito", role: "Apresenta o mecanismo e ancora valor" },
    { stage: "Contrato de entrada", price: "Sob medida", role: "Setup + primeiros 90 dias com meta clara" },
    { stage: "Fee recorrente", price: "Mensal", role: "Gestão contínua atrelada a ROAS/CAC" },
    { stage: "Upsell de escopo", price: "Escalonado", role: "Novos canais conforme o CAC permite escalar" },
  ],
};

const trackingBase = [
  "UTMs completas (source, medium, campaign, content, term)",
  "Google Analytics 4 (GA4) + eventos de conversão",
  "Google Tag Manager (GTM) como camada única",
];

const trackingByTraffic: Record<TrafficLevel, string[]> = {
  zero: ["Pixel Meta + tag do Google Ads instalados corretamente", "Eventos padrão de checkout (InitiateCheckout, Purchase)"],
  some: ["API de Conversões (CAPI) server-side para recuperar dados perdidos pelo iOS", "Custom events de VSL (25/50/75/pitch)"],
  scaling: [
    "Server-Side Tracking completo (CAPI + GA4 server-side)",
    "Atribuição data-driven e Looker Studio para decisão em tempo real",
    "Webhooks de 1-click upsell e reconciliação de receita",
  ],
};

const readinessMap: Record<TrafficLevel, number> = { zero: 28, some: 58, scaling: 82 };

export function generateBlueprint(input: GarimpoInput): Blueprint {
  const niche = cleanNiche(input.niche);
  const acr = acronymFrom(niche);

  const bigIdea = `A forma mais rápida de escalar em "${niche}" não é criar do zero — é modelar a oferta que já está vendendo no tráfego e recriá-la com terminologia proprietária e rastreamento server-side impecável.`;

  const mechanismName = `Protocolo ${acr} 101x`;

  const mechanismSteps = [
    `Garimpo: mapear anúncios ativos há +90 dias no nicho "${niche}" (Meta Ads Library / TikTok Creative Center) para validar demanda real.`,
    "Recomposição autoral: recriar o mecanismo único com 100% de direitos autorais e nova nomenclatura proprietária.",
    "Engenharia de dados: taguear tudo com UTMs + CAPI server-side para atribuição correta e escala preditiva.",
  ];

  const funnel = funnelByTier[input.ticket];
  const trackingStack = [...trackingBase, ...trackingByTraffic[input.traffic]];
  const scaleReadiness = readinessMap[input.traffic];

  let priorityMove: string;
  if (input.traffic === "zero") {
    priorityMove =
      "Sua prioridade é a fundação de dados: instalar tracking correto ANTES de investir em mídia. Rodar tráfego sem medir conversão é queimar verba no escuro.";
  } else if (input.traffic === "some") {
    priorityMove =
      "Seu gargalo é atribuição. Implementar CAPI server-side recupera as conversões perdidas e estabiliza o ROAS — normalmente é o que separa a campanha instável da escalável.";
  } else {
    priorityMove =
      "Você já tem tração. O próximo salto vem de otimização preditiva: atribuição data-driven, testes de oferta e expansão de escada de valor para elevar o LTV sem subir o CAC.";
  }

  const offerAngle =
    input.ticket === "servico"
      ? "Posicione o serviço como engenharia de aquisição — venda previsibilidade (CAC/ROAS), não horas."
      : "Ancore o preço numa Oferta Grand Slam: core + bônus antídoto + inversão total de risco (garantia incondicional).";

  return {
    bigIdea,
    mechanismName,
    mechanismSteps,
    funnel,
    trackingStack,
    scaleReadiness,
    priorityMove,
    offerAngle,
  };
}
