# Kamillo Santos — Assessoria de Marketing Digital · Design

Portal de autoridade + máquina de atração orgânica de leads para Kamillo Santos (gestor de tráfego sênior).
Web-only. Visual: tech premium, escuro, "engenharia de aquisição" — hero 3D interativo, glassmorphism, brilho azul elétrico. Objetivo: ranquear para o nicho de marketing digital (SEO semântico + cluster de conteúdo) e converter em leads via WhatsApp/formulário.

## Brand & Colors

CSS variables em `packages/web/src/web/styles.css`. Dark-only (sem modo claro).

| Token | Valor | Uso |
|-------|-------|-----|
| --bg | #04060F | Fundo base (near-black azulado) |
| --bg-2 | #070B1A | Fundo de seção alternada |
| --surface | #0B1122 | Cards / superfícies |
| --surface-2 | #111A31 | Cards elevados / hover |
| --border | rgba(96,165,250,.14) | Hairlines com brilho azul |
| --fg | #EEF2FB | Texto primário |
| --muted | #93A2C4 | Texto secundário |
| --primary | #3B82F6 | Azul elétrico — CTAs, destaques |
| --primary-600 | #2563EB | Hover de CTA |
| --cyan | #22D3EE | Detalhe de alta performance / acento 2 |
| --violet | #8B5CF6 | Acento 3 pontual (dados/IA) |
| --success | #25D366 | WhatsApp |

Gradiente de destaque: `linear-gradient(100deg,#60A5FA,#22D3EE)` para texto e bordas de foco.
Fundos: mesh gradient azul + textura de grid/noise sutil + glow radial atrás do hero 3D.

## Typography

- **Display**: `Sora` (700/800) — títulos, H1/H2.
- **Body**: `Manrope` (400/500/600) — parágrafos, UI.
- Carregadas via Google Fonts (@import em styles.css). Line-height generoso (1.6 corpo, 1.05 display). Hierarquia por tamanho/peso, não por cor apenas.
- Evitar Inter/Roboto/Space Grotesk.

## Layout & Motion

- Container 1180px, seções com respiro (96–120px vertical em desktop).
- Grid quebrado: cards de serviço assimétricos, seção de método em timeline diagonal.
- Motion: `motion` (framer-motion) — reveal com stagger no scroll (uma orquestração por seção, sutil). Hero 3D reage ao mouse.
- 3D: `@react-three/fiber` + `@react-three/drei` — esfera distorcida + partículas com parallax de mouse no hero.

## Pages

- **Home** (`pages/index.tsx`): Header · Hero 3D · Stats · Serviços · Método C.P.A.V. · Resultados/Depoimento · Sobre/Autoridade · Blog (últimos posts) · FAQ · CTA/Formulário · Footer.
- **Blog** (`pages/blog.tsx`): índice do cluster de conteúdo (listagem de artigos por categoria/keyword).
- **Artigo** (`pages/blog-post.tsx`, rota `/blog/:slug`): conteúdo longo otimizado, JSON-LD BlogPosting, CTA.

## SEO (núcleo do projeto)

- `<Seo>` component: define `document.title`, meta description/keywords, canonical, Open Graph, Twitter, e injeta JSON-LD por página.
- `index.html`: meta base + JSON-LD Person/Organization/WebSite (SearchAction).
- Cluster de conteúdo: artigos cobrindo intenções do nicho (assessoria de marketing digital, gestor de tráfego, gestão de mídias sociais, pesquisa de mercado, otimização de site/SEO, tráfego pago).
- `public/robots.txt` + `public/sitemap.xml`.
- FAQ com schema FAQPage; Serviços com schema Service.

## Conversão (sem dark patterns)

- Botão flutuante WhatsApp (pulso sutil, fixo — sem seguir o mouse, sem bloquear saída).
- Exit-intent leve: modal único, dismissível, oferecendo diagnóstico gratuito (não bloqueia teclas/scroll, sem beforeunload).
- Formulário de diagnóstico → API `leads.create` (Drizzle table `leads`).

## Data / API

- Table `leads` (nome, contato, empresa, mensagem, origem, createdAt).
- `leads.create` (oRPC) salva o lead; UI mostra loading + sucesso.
