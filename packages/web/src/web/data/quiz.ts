export type QuizOption = {
  label: string;
  score: 0 | 1 | 2 | 3;
};

export type QuizQuestion = {
  id: string;
  pillar: string;
  question: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "trafego",
    pillar: "Tráfego pago",
    question: "Como está seu investimento em anúncios (Google / Meta Ads) hoje?",
    options: [
      { label: "Não invisto em tráfego pago", score: 0 },
      { label: "Já impulsionei alguns posts, mas sem estratégia", score: 1 },
      { label: "Rodo campanhas, mas o retorno é instável", score: 2 },
      { label: "Tenho campanhas estruturadas com metas de CPA/ROAS", score: 3 },
    ],
  },
  {
    id: "conteudo",
    pillar: "Conteúdo & autoridade",
    question: "Como está sua presença de conteúdo nas redes sociais?",
    options: [
      { label: "Praticamente parada / sem constância", score: 0 },
      { label: "Posto de vez em quando, sem planejamento", score: 1 },
      { label: "Tenho constância, mas gera pouco engajamento/lead", score: 2 },
      { label: "Conteúdo estratégico que gera autoridade e demanda", score: 3 },
    ],
  },
  {
    id: "site",
    pillar: "Site & SEO",
    question: "Seu site aparece no Google e gera contatos organicamente?",
    options: [
      { label: "Não tenho site (ou ele não gera nada)", score: 0 },
      { label: "Tenho site, mas ninguém encontra no Google", score: 1 },
      { label: "Apareço para algumas buscas, mas converte pouco", score: 2 },
      { label: "Ranqueio bem e o site gera leads todo mês", score: 3 },
    ],
  },
  {
    id: "dados",
    pillar: "Dados & rastreio",
    question: "Você mede conversões e sabe seu custo por cliente?",
    options: [
      { label: "Não faço ideia dos meus números", score: 0 },
      { label: "Olho curtidas e alcance, mas não conversões", score: 1 },
      { label: "Acompanho alguns dados, mas sem rastreio completo", score: 2 },
      { label: "Rastreio conversões e sei meu CPA e ROAS", score: 3 },
    ],
  },
  {
    id: "estrategia",
    pillar: "Estratégia & previsibilidade",
    question: "Você consegue prever quantos leads/clientes vão chegar no mês?",
    options: [
      { label: "Depende totalmente de indicação e sorte", score: 0 },
      { label: "Tenho uma ideia vaga, varia demais", score: 1 },
      { label: "Consigo estimar, mas com margem grande de erro", score: 2 },
      { label: "Tenho previsibilidade clara de aquisição", score: 3 },
    ],
  },
];

export type QuizResult = {
  scorePct: number;
  level: string;
  levelColor: string;
  headline: string;
  summary: string;
  priorityPillar: string;
  priorityAdvice: string;
};

const pillarAdvice: Record<string, string> = {
  "Tráfego pago":
    "Sua maior alavanca agora é o tráfego pago bem estruturado. Campanhas de Google e Meta Ads com metas claras de CPA e ROAS vão transformar verba em clientes previsíveis — em vez de dinheiro jogado fora.",
  "Conteúdo & autoridade":
    "O que mais trava seu crescimento é a falta de conteúdo estratégico. Uma presença consistente nas redes constrói autoridade e gera demanda, reduzindo o custo de aquisição no tráfego pago.",
  "Site & SEO":
    "Seu maior gargalo é o site e o SEO. Otimizar sua presença orgânica faz você ser encontrado por quem já procura pela sua solução — um canal de leads que não depende de verba de mídia.",
  "Dados & rastreio":
    "O ponto crítico é a falta de dados. Sem rastreamento de conversões, você decide no escuro. Implementar mensuração correta é o primeiro passo para escalar com segurança.",
  "Estratégia & previsibilidade":
    "Você já executa, mas falta amarrar tudo numa estratégia com previsibilidade. Conectar tráfego, conteúdo e dados a metas de negócio transforma esforço solto em máquina de aquisição.",
};

export function computeResult(answers: Record<string, number>): QuizResult {
  const entries = quizQuestions.map((q) => ({
    pillar: q.pillar,
    score: answers[q.id] ?? 0,
  }));

  const total = entries.reduce((s, e) => s + e.score, 0);
  const max = quizQuestions.length * 3;
  const scorePct = Math.round((total / max) * 100);

  // weakest pillar = biggest opportunity
  const weakest = entries.reduce((min, e) => (e.score < min.score ? e : min), entries[0]);

  let level: string;
  let levelColor: string;
  let headline: string;
  let summary: string;

  if (scorePct < 34) {
    level = "Marketing no início";
    levelColor = "#f87171";
    headline = "Há muito dinheiro ficando na mesa";
    summary =
      "Seu marketing ainda depende de sorte e indicação. A boa notícia: com uma base bem montada, o potencial de crescimento é enorme.";
  } else if (scorePct < 67) {
    level = "Em desenvolvimento";
    levelColor = "#fbbf24";
    headline = "Você já corre, mas sem previsibilidade";
    summary =
      "Você já faz várias coisas certas, mas os resultados oscilam. Com ajustes estratégicos, dá para transformar esforço em aquisição previsível.";
  } else {
    level = "Estruturado";
    levelColor = "#22d3ee";
    headline = "Base sólida — hora de escalar";
    summary =
      "Seu marketing já está maduro. O próximo passo é otimizar e escalar com segurança, ampliando o volume sem perder eficiência.";
  }

  return {
    scorePct,
    level,
    levelColor,
    headline,
    summary,
    priorityPillar: weakest.pillar,
    priorityAdvice: pillarAdvice[weakest.pillar] ?? "",
  };
}
