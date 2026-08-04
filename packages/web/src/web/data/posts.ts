import { postsVendasAfiliados } from "./posts-vendas-afiliados";
import { postsDigistoreComparacao } from "./posts-digistore-comparacao";
import { postsPagamentosProdutos } from "./posts-pagamentos-produtos";

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  keyword: string;
  category: string;
  readingTime: number;
  date: string; // ISO
  excerpt: string;
  html: string;
};

const basePosts: Post[] = [
  {
    slug: "assessoria-de-marketing-digital-guia-completo",
    title: "Assessoria de Marketing Digital: o guia completo para escalar vendas",
    metaTitle:
      "Assessoria de Marketing Digital: Guia Completo 2026 | Kamillo Santos",
    description:
      "O que é assessoria de marketing digital, o que ela entrega, quanto custa e como escolher. Guia definitivo para transformar sua empresa em uma máquina de aquisição de clientes.",
    keyword: "assessoria de marketing digital",
    category: "Estratégia",
    readingTime: 8,
    date: "2026-01-12",
    excerpt:
      "Entenda o que é assessoria de marketing digital, o que está incluído, quanto custa e como escolher a certa para gerar leads previsíveis.",
    html: `
<p>Se você busca <strong>assessoria de marketing digital</strong>, provavelmente já sentiu na pele o problema: campanhas que gastam sem retorno, redes sociais paradas e um site que ninguém encontra. Este guia mostra o que uma assessoria de verdade entrega e como ela transforma seu marketing em um sistema previsível de vendas.</p>

<h2>O que é uma assessoria de marketing digital?</h2>
<p>Uma assessoria de marketing digital é a parceria estratégica que assume o planejamento e a execução do crescimento online da sua empresa. Diferente de freelas pontuais, ela cuida do ecossistema completo: posicionamento, tráfego pago, conteúdo, SEO e análise de dados — tudo conectado a metas de negócio.</p>

<h2>O que está incluído</h2>
<ul>
  <li><strong>Estratégia e planejamento:</strong> definição de público ideal (ICP), oferta e jornada de compra.</li>
  <li><strong>Tráfego pago:</strong> campanhas de Google Ads e Meta Ads com foco em CPA e ROAS.</li>
  <li><strong>Gestão de mídias sociais:</strong> conteúdo que gera autoridade e demanda.</li>
  <li><strong>Pesquisa de mercado:</strong> inteligência competitiva e mapeamento de personas.</li>
  <li><strong>Otimização de sites (SEO):</strong> para ser encontrado organicamente no Google.</li>
</ul>

<h2>Quanto custa uma assessoria de marketing digital?</h2>
<p>O investimento varia conforme o estágio do negócio, a verba de mídia e os objetivos. O mais importante não é o custo isolado, mas o retorno: uma boa assessoria se paga ao reduzir o custo de aquisição e aumentar o volume de clientes qualificados. O caminho certo é começar por um diagnóstico para dimensionar a estratégia.</p>

<h2>Como escolher a assessoria certa</h2>
<p>Procure quem fala a língua de resultado, mostra método claro e mede tudo por dados. Fuja de promessas mágicas e de quem não rastreia conversões. A pergunta central deve ser sempre: "quanto custa para adquirir um cliente e como reduzimos esse custo com o tempo?"</p>

<h2>Conclusão</h2>
<p>Assessoria de marketing digital não é despesa — é engenharia de aquisição. Com estratégia, tráfego e conteúdo trabalhando juntos, sua empresa deixa de depender de sorte e passa a ter um canal de vendas previsível.</p>
`,
  },
  {
    slug: "gestor-de-trafego-senior-o-que-faz",
    title: "Gestor de tráfego sênior: o que faz e por que contratar um",
    metaTitle:
      "Gestor de Tráfego Sênior: O Que Faz e Como Escolher | Kamillo Santos",
    description:
      "Entenda o papel de um gestor de tráfego sênior, a diferença para um iniciante e como um especialista reduz CPA e escala campanhas com ROAS previsível.",
    keyword: "gestor de tráfego sênior",
    category: "Tráfego Pago",
    readingTime: 7,
    date: "2026-01-20",
    excerpt:
      "O que faz um gestor de tráfego sênior, a diferença para um júnior e por que a senioridade impacta diretamente no seu CPA.",
    html: `
<p>Contratar um <strong>gestor de tráfego sênior</strong> é diferente de contratar alguém que "sabe subir campanha". A senioridade aparece justamente onde o dinheiro é ganho ou perdido: leitura de dados, estruturação de funil e decisões de escala.</p>

<h2>O que faz um gestor de tráfego</h2>
<p>O gestor de tráfego planeja, executa e otimiza campanhas pagas em plataformas como Google Ads e Meta Ads. Mas o trabalho vai além dos anúncios: envolve rastreamento de conversões, análise de métricas, testes de criativos e alinhamento com a oferta e a página de destino.</p>

<h2>Júnior x Sênior: a diferença que pesa no bolso</h2>
<ul>
  <li><strong>Diagnóstico:</strong> o sênior identifica se o problema está no anúncio, na oferta ou na página — e não desperdiça verba testando às cegas.</li>
  <li><strong>Estrutura:</strong> monta campanhas pensando em aprendizado do algoritmo e escala, não só em cliques.</li>
  <li><strong>Dados:</strong> toma decisões por CPA, ROAS e LTV, não por métricas de vaidade.</li>
  <li><strong>Rastreamento:</strong> implementa medição confiável (inclusive server-side) para o algoritmo otimizar certo.</li>
</ul>

<h2>Quando contratar</h2>
<p>Se você já investe em anúncios mas não tem previsibilidade, ou quer escalar sem estourar o custo por aquisição, é hora de um especialista sênior. A senioridade se paga na redução do CPA e no aumento do retorno.</p>

<h2>Conclusão</h2>
<p>Um gestor de tráfego sênior é o profissional que transforma verba de mídia em aquisição previsível. É a diferença entre "gastar em anúncios" e "investir em crescimento".</p>
`,
  },
  {
    slug: "trafego-pago-google-ads-meta-ads",
    title: "Tráfego pago: como estruturar campanhas com ROAS previsível",
    metaTitle: "Tráfego Pago: Guia de Google Ads e Meta Ads | Kamillo Santos",
    description:
      "Como funciona o tráfego pago, diferenças entre Google Ads e Meta Ads e o passo a passo para estruturar campanhas com CPA mínimo e ROAS previsível.",
    keyword: "tráfego pago",
    category: "Tráfego Pago",
    readingTime: 9,
    date: "2026-02-03",
    excerpt:
      "O passo a passo para estruturar campanhas de tráfego pago no Google Ads e Meta Ads com CPA controlado e retorno previsível.",
    html: `
<p><strong>Tráfego pago</strong> é a forma mais rápida de colocar sua oferta na frente de quem tem intenção de compra. Mas rapidez sem estratégia vira desperdício. Veja como estruturar campanhas que realmente vendem.</p>

<h2>Google Ads x Meta Ads: qual usar?</h2>
<p>No <strong>Google Ads</strong>, você captura a demanda existente — pessoas que já pesquisam pela solução. No <strong>Meta Ads</strong> (Instagram e Facebook), você gera demanda, apresentando a oferta a públicos com o perfil certo. A estratégia mais robusta combina os dois: gerar e capturar demanda ao mesmo tempo.</p>

<h2>Passo a passo de uma campanha de alta performance</h2>
<ul>
  <li><strong>1. Oferta e página:</strong> antes do anúncio, garanta uma oferta clara e uma landing page que converte.</li>
  <li><strong>2. Rastreamento:</strong> configure a medição de conversões (idealmente server-side) para alimentar o algoritmo.</li>
  <li><strong>3. Estrutura:</strong> monte campanhas que deem ao algoritmo dados suficientes para aprender.</li>
  <li><strong>4. Criativos:</strong> teste ângulos diferentes — dor, storytelling e urgência.</li>
  <li><strong>5. Otimização:</strong> corte o que não performa e escale o que traz o menor CPA.</li>
</ul>

<h2>As métricas que importam</h2>
<p>Ignore curtidas e foque em <strong>CPA</strong> (custo por aquisição), <strong>ROAS</strong> (retorno sobre o investimento) e <strong>LTV</strong> (valor do cliente no tempo). São elas que dizem se a máquina é lucrativa.</p>

<h2>Conclusão</h2>
<p>Tráfego pago bem feito é engenharia: oferta certa, rastreamento confiável e otimização por dados. É assim que se chega a um ROAS previsível e escalável.</p>
`,
  },
  {
    slug: "otimizacao-de-sites-seo-semantico",
    title: "Otimização de sites (SEO): como ser encontrado no seu nicho",
    metaTitle:
      "Otimização de Sites e SEO Semântico: Guia Prático | Kamillo Santos",
    description:
      "Aprenda como a otimização de sites e o SEO semântico fazem sua empresa ser encontrada por quem digita qualquer termo do seu nicho no Google.",
    keyword: "otimização de sites SEO",
    category: "SEO",
    readingTime: 8,
    date: "2026-02-15",
    excerpt:
      "Como o SEO técnico e o SEO semântico, com clusters de conteúdo, colocam seu site à frente da concorrência no Google.",
    html: `
<p>A <strong>otimização de sites (SEO)</strong> é o que faz sua empresa ser encontrada de forma orgânica — sem pagar por clique — por quem procura no Google. E o segredo em 2026 não é só palavra-chave: é <strong>SEO semântico</strong>.</p>

<h2>Os três pilares do SEO</h2>
<ul>
  <li><strong>SEO técnico:</strong> velocidade, Core Web Vitals, indexação, dados estruturados (Schema) e site mobile-first.</li>
  <li><strong>SEO de conteúdo:</strong> responder de verdade à intenção de busca do usuário.</li>
  <li><strong>Autoridade:</strong> links, menções e consistência que sinalizam relevância ao Google.</li>
</ul>

<h2>O que é SEO semântico</h2>
<p>O Google não busca mais apenas por termos exatos — ele entende <em>tópicos</em> e <em>intenções</em>. SEO semântico significa cobrir um tema em profundidade, conectando subtópicos, sinônimos e perguntas relacionadas. É assim que uma página passa a ranquear para dezenas de variações de busca.</p>

<h2>Clusters de conteúdo: a estratégia de portal</h2>
<p>Em vez de páginas soltas, você cria um <strong>cluster</strong>: uma página principal (pilar) cercada de artigos de apoio que se interligam. Essa arquitetura sinaliza autoridade sobre o assunto e faz o site inteiro subir — funcionando como um verdadeiro portal do nicho.</p>

<h2>Conclusão</h2>
<p>Otimização de sites é construir um ativo. Com SEO técnico sólido e um cluster de conteúdo semântico, você deixa de depender só de anúncios e passa a atrair leads orgânicos de forma composta.</p>
`,
  },
  {
    slug: "gestao-de-midias-sociais-autoridade",
    title: "Gestão de mídias sociais: de perfil parado a gerador de demanda",
    metaTitle:
      "Gestão de Mídias Sociais que Gera Vendas | Kamillo Santos",
    description:
      "Como uma gestão de mídias sociais estratégica constrói autoridade, engaja a audiência certa e gera demanda real para o seu negócio.",
    keyword: "gestão de mídias sociais",
    category: "Social Media",
    readingTime: 6,
    date: "2026-02-27",
    excerpt:
      "Como transformar redes sociais paradas em um canal que constrói autoridade e gera demanda qualificada.",
    html: `
<p><strong>Gestão de mídias sociais</strong> não é postar por postar. É usar Instagram, TikTok, LinkedIn e Facebook como canais estratégicos de autoridade e geração de demanda.</p>

<h2>Do conteúdo aleatório à estratégia</h2>
<p>Perfis param de crescer quando o conteúdo não tem direção. A virada acontece com um <strong>calendário editorial</strong> alinhado às dores da audiência e à jornada de compra: conteúdo para atrair, nutrir e converter.</p>

<h2>Os pilares de uma boa gestão</h2>
<ul>
  <li><strong>Posicionamento:</strong> uma mensagem clara que diferencia sua marca.</li>
  <li><strong>Consistência:</strong> frequência sustentável e identidade visual coerente.</li>
  <li><strong>Engajamento:</strong> gestão de comunidade e resposta ativa.</li>
  <li><strong>Conteúdo com intenção:</strong> alinhado ao que a audiência busca — reforçando também o SEO.</li>
</ul>

<h2>Social + tráfego pago</h2>
<p>O conteúdo orgânico valida ângulos e mensagens que depois viram criativos de tráfego pago. Juntos, orgânico e pago criam um ciclo de autoridade e aquisição.</p>

<h2>Conclusão</h2>
<p>Gestão de mídias sociais estratégica transforma seguidores em demanda. É presença com propósito, medida por negócio — não por curtidas.</p>
`,
  },
  {
    slug: "pesquisa-de-mercado-decisoes-por-dados",
    title: "Pesquisa de mercado: como decidir por dados e não por achismo",
    metaTitle:
      "Pesquisa de Mercado para Marketing Digital | Kamillo Santos",
    description:
      "Entenda como a pesquisa de mercado orienta estratégia, oferta e campanhas, reduzindo risco e aumentando o retorno do seu marketing digital.",
    keyword: "pesquisa de mercado",
    category: "Estratégia",
    readingTime: 6,
    date: "2026-03-10",
    excerpt:
      "Por que a pesquisa de mercado é a base de qualquer estratégia de marketing que dá certo — e como ela reduz o custo de aquisição.",
    html: `
<p><strong>Pesquisa de mercado</strong> é o que separa decisões estratégicas de apostas caras. Antes de investir em tráfego ou conteúdo, você precisa saber com quem fala, o que essa pessoa valoriza e como a concorrência se posiciona.</p>

<h2>Para que serve na prática</h2>
<ul>
  <li><strong>Mapear personas:</strong> entender dores, desejos e objeções reais.</li>
  <li><strong>Analisar concorrência:</strong> benchmarks de oferta, preço e comunicação.</li>
  <li><strong>Validar oferta:</strong> testar proposta de valor e precificação antes de escalar.</li>
  <li><strong>Descobrir intenção de busca:</strong> os termos que seu público realmente pesquisa.</li>
</ul>

<h2>Como a pesquisa reduz o CPA</h2>
<p>Quando você fala exatamente a linguagem da dor do cliente, o anúncio converte mais e o custo por aquisição cai. Pesquisa não é etapa burocrática — é a alavanca que torna todo o resto mais barato e eficiente.</p>

<h2>Conclusão</h2>
<p>Marketing orientado a dados começa na pesquisa. Ela reduz risco, afia a mensagem e faz cada real investido render mais.</p>
`,
  },
];

export const posts: Post[] = [
  ...basePosts,
  ...postsVendasAfiliados,
  ...postsDigistoreComparacao,
  ...postsPagamentosProdutos,
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const categories: string[] = Array.from(
  new Set(posts.map((p) => p.category)),
);

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
