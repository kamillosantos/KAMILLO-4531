# Kamillo Santos — Site + Painel #KamilloSantosProtocol

Site institucional (assessoria de marketing digital / tráfego pago) + painel interno
(`/painel`) com módulos B2B Kanban, B2C funil, Roboavaliador Pre-Flight, RevOps/Governança
e Dev Engine. Inclui ferramenta interativa de lead-gen `/garimpo` e quiz nos artigos do blog.

## Stack

- **Runtime/build:** Bun + Vite + Turborepo (monorepo)
- **Frontend:** React + Wouter (router) + TanStack Query + Framer Motion + Tailwind
- **Backend:** Hono (API) rodando no server Bun unificado
- **Banco:** Drizzle ORM + Turso (libSQL)
- **Multiplataforma:** `packages/web` (site+API), `packages/mobile` (Expo), `packages/desktop` (Electron)

## Estrutura

```
packages/
  web/       -> site institucional + API Hono + painel (/painel) + garimpo
    src/web/     -> React (pages, components, sections, queries)
    src/api/     -> rotas Hono, schema Drizzle, webhooks de gateways
  mobile/    -> app Expo (template)
  desktop/   -> app Electron (template)
```

## Rodando localmente

```bash
# 1. instalar deps
bun install

# 2. criar o .env a partir do template e preencher as variáveis
cp .env.template .env
#   -> preencha TURSO_DATABASE_URL, TURSO_AUTH_TOKEN etc.

# 3. subir o schema do banco
cd packages/web && bun --env-file=../../.env drizzle-kit push && cd ../..

# 4. dev
bun run dev

# build de produção
bun run build
```

> **Importante:** os arquivos `.env` NÃO estão neste repositório (contêm segredos).
> Use `.env.template` como referência das variáveis necessárias.

## Subindo no GitHub

```bash
git init
git add .
git commit -m "Kamillo Santos — site + painel #KamilloSantosProtocol"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/kamillo-santos.git
git push -u origin main
```
