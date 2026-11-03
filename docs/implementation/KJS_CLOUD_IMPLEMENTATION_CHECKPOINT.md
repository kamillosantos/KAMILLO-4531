# KJS Ecosystem — Cloud Implementation Checkpoint

**Branch:** `feat/kjs-ecosystem-consolidation`  
**Checkpoint:** 2026-11-03  
**Overall state:** `IMPLEMENTATION_IN_PROGRESS / NOT_CERTIFIED`

## Eight workstreams

1. **Repository reconciliation — PARTIAL:** KAMILLO-4531 remains the application plane; IMPRRSDOR remains the control plane. No merge or production branch change.
2. **Security — PARTIAL:** purchase webhooks fail closed without a configured 32+ character secret, validate HMAC-SHA256 on raw request bytes, require an explicit idempotency key and validate amount/currency/status. Generic KJS envelope only; native provider adapters and integration tests remain.
3. **Institutional context — PARTIAL:** added `docs/architecture/KJS_CONTEXT_MANIFEST.json` to anchor architecture, research, cinema skill, and frontend preservation rules. Existing design tokens are to be reused; no new design system or visual baseline was invented.
4. **Orchestration — PARTIAL:** shared typed job state machine blocks illegal transitions, requires approval when configured and requires QA evidence before `SUCCEEDED`. Durable distributed queue/worker is not wired.
5. **Agency LLM services — NOT CONNECTED:** current CRM remains deterministic/rule-based unless a real provider integration is independently verified.
6. **Cinema — PARTIAL:** creative planning now emits a validated operational event with correlation ID. Rendering, upload, upscaling, audio mastering and final media QA are separate unimplemented stages.
7. **Data Genius — PARTIAL:** typed event contract, persistent `ecosystem_events` ledger, authenticated cross-repository ingestion API, protected read API, and existing-panel UI tab added. SQL migration is committed but not applied to any live database. External producers must send signed-in/authenticated events using `DATA_GENIUS_INGEST_TOKEN`.
8. **Verification — IN PROGRESS:** branch CI workflow added for Bun install, typecheck, event-contract tests and web build. Latest workflow execution must complete successfully before certification.

## New files and changes
- `packages/web/src/api/observability/event-contract.ts`
- `packages/web/src/api/observability/event-contract.test.ts`
- `docs/architecture/KJS_CONTEXT_MANIFEST.json`
- `packages/web/src/api/creative-orchestrator.ts` now emits and persists a validated `cinema.plan.created` event.
- `packages/web/src/api/index.ts` exposes `POST /api/observability/ingest` (shared bearer token) and `GET /api/observability/events` (CRM operator session).
- `packages/web/src/web/components/painel/data-genius.tsx` and the existing panel navigation provide the event ledger view.
- `packages/web/drizzle/0001_data_genius.sql` contains the schema migration; apply it only through the approved database change process.
- `.env.template` documents `DATA_GENIUS_INGEST_TOKEN`; the real secret must be configured in the server secret store, never committed.
- `packages/web/src/api/index.ts` now rejects unsigned or non-idempotent purchase webhook requests.

## Webhook envelope contract
The current generic KJS envelope expects:
- `x-kjs-signature: sha256=<lowercase-hex-hmac>`, computed over the exact raw HTTP request body;
- `x-idempotency-key` with a stable provider event identifier;
- server secret `KJS_<GATEWAY>_WEBHOOK_SECRET` or fallback `KJS_WEBHOOK_SHARED_SECRET`, minimum 32 characters.

This does not claim compatibility with native provider webhook signatures. A provider-specific adapter must verify the provider's official signature and then forward a signed KJS envelope. Do not expose secrets in browser code.

## Release boundary
No deployment, provisioning, paid activation, schema migration, or production UI change was performed. No real provider, WhatsApp, CRM LLM, media renderer, or global event sink is certified as connected.

**Release state:** `NOT_CERTIFIED`. The migration is not applied, external event producers are not configured, and CI must pass before any release.
