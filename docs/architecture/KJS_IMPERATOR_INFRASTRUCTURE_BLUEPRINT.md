# KJS IMPERATOR Ω — Infrastructure & Execution Blueprint
## Draft for owner approval

**Protocol:** #KamilloSantosProtocol  
**Governance:** #520ATIVADO  
**Prepared:** 2026-11-03  
**Repository:** kamillosantos/KAMILLO-4531  
**Target branch:** feat/kjs-imperator-movie-agent  
**Document status:** DRAFT_FOR_OWNER_APPROVAL  
**Implementation status:** NOT_IMPLEMENTED / NOT_CERTIFIED

---

## 1. Executive decision

Do not rebuild the platform and do not introduce a second application stack.

Consolidate the existing repository into one operational system with:

1. Existing Bun + React + Hono application as the product and API surface.
2. Turso/libSQL as the initial operational database, because the application already uses Drizzle and libSQL.
3. One durable asynchronous job queue.
4. Cloudflare R2 (S3-compatible) for source media, generated assets, previews, and approved masters.
5. 9Router for text-based creative direction and model routing.
6. xAI Imagine as a video/image provider adapter, not as the entire production pipeline.
7. On-demand GPU workers for media processing and upscale.
8. Data Genius as the event and cost ledger.
9. One control plane in the frontend for agents, jobs, approvals, costs, and evidence.

The current PM2 configuration is a deployment recipe, not proof of a running VPS. The current Docker Compose file is a local service definition, not proof of a production deployment. Do not create or purchase another runtime until the existing host and its ownership are verified.

No Render or Vercel deployment is proposed. No new production infrastructure is activated by this document.

---

## 2. Repository facts inspected

Target branch: `feat/kjs-imperator-movie-agent`

- Branch comparison against `main`: 19 commits ahead, 0 behind at inspection.
- Branch head at inspection: `ae4347c020c2614c71826e432f041d40683778ac`.
- Cinematic Master Skill exists at `docs/skills/KJS_IMPERATOR_CINEMATIC_MASTER.md`.
- Imperator Movie UI exists at `packages/web/src/web/components/painel/imperator-movie.tsx` (550 lines).
- Creative API exists at `packages/web/src/api/creative-orchestrator.ts`.
- API mounts the creative orchestrator from `packages/web/src/api/index.ts`.
- `.env.template` documents 9Router and optional engine bridge variables.
- `ecosystem.config.cjs` defines one PM2-managed Bun web process.
- `services/agent-core` contains a separate FastAPI + PostgreSQL + Redis + Celery service and Docker Compose definition.
- No GitHub Actions workflow run was found for `feat/kjs-imperator-movie-agent` at inspection.
- No deployment or live production health check was verified.

### Important implementation gaps

1. The Movie UI defaults to 4K; it offers 8K but does not offer a 12K profile.
2. The UI's file inputs only retain filenames in browser state; no media upload is performed.
3. “Prepare briefing” creates a local preview; it does not create a durable production job.
4. The creative API calls 9Router synchronously and returns a plan for human approval. It does not render, upload, publish, persist a job, or dispatch a worker.
5. The engine catalog does not contain an xAI adapter.
6. `.env.template` has no xAI API key, object-storage credentials, queue credentials, or configured FFmpeg worker URL.
7. The Data Genius ingestion variables are placeholders and no event delivery was verified.
8. The Board Academy and Sovereign Board are not present as operational tabs in the inspected panel.
9. The separate Agent Core pipeline contains hardcoded sample insights, a sample 4.8% CTR, and sample leads. Those are demonstration values, not live intelligence, and must never be reported as production data.
10. The Agent Core service is not integrated into the Hono application in the inspected API composition.
11. The current creative API uses a shared bearer token for its plan endpoint. Before production, add scoped user/session authorization, rate limits, tenant authorization, and audit records.
12. The inspected gateway webhook handler accepts listed gateway slugs but does not show provider signature verification. Verify signatures and idempotency before using webhook data as financial truth.

---

## 3. Proposed infrastructure

### 3.1 Application runtime

**Preferred:** reuse the existing Bun + Hono application and its current host, if an active host is confirmed.

The repository already contains a PM2 process definition for one Bun server. Keep this deployment shape initially; do not migrate frameworks or split the web/API into multiple services without a measured reason.

**If no existing VPS is available:** compare a small general-purpose VPS before purchasing:
- Hetzner CPX22: listed at approximately US$22.99/month excluding VAT in Germany/Finland.
- DigitalOcean Basic 2 vCPU / 4 GiB: listed at US$24/month.

These are comparison references, not a purchase recommendation. Choose region based on latency, data residency, availability, billing terms, and actual project requirements. A CPU VPS is for the web/API and lightweight orchestration, not 8K/12K GPU rendering.

### 3.2 Operational database

**Preferred initial source of truth: Turso/libSQL + Drizzle.**

Reason:
- Already used by the main application.
- Existing schema and route modules use Drizzle's SQLite/libSQL layer.
- Avoids introducing a second primary database just to support the agent subsystem.

Indicative published Turso plans at preparation time:
- Free: US$0; 5 GB storage, 500M rows read/month, 10M rows written/month.
- Developer: US$4.99/month; 9 GB storage, 2.5B rows read/month, 25M rows written/month.
- Scaler: US$24.92/month; 24 GB storage, 100B rows read/month, 100M rows written/month.

Start with the current account's actual plan and measured usage. Upgrade only when measured quotas or recovery requirements justify it.

**PostgreSQL decision:** do not operate the Agent Core PostgreSQL database as a second source of truth in the MVP. Either migrate its required job/tenant records into the selected operational model or explicitly approve a separate database boundary after a data model review.

### 3.3 Asynchronous jobs and orchestration queue

**Preferred MVP candidate: Upstash QStash / Workflow.**

Why:
- HTTP-first delivery integrates cleanly with the existing Hono/Bun API.
- Provides retries and delayed delivery without maintaining a Redis server.
- Can trigger short-lived workers and receive completion callbacks.
- Published pricing lists 1,000 messages/day on Free and US$1 per 100,000 messages on pay-as-you-go. Each retry is another billable delivery attempt.

**Scale alternative: Cloudflare Queues.**
- Supports batching, retries, delays, and dead-letter queues.
- Workers Paid is listed at US$5/month minimum.
- Queues include 1M operations/month on Workers Paid, then US$0.40 per additional million operations.
- External pull consumers are supported, which can allow a worker outside Cloudflare to consume jobs.

Do not activate both queue systems. Select one after a small reliability and latency test. Every queue must have retry limits, a dead-letter queue, idempotency, cancellation, per-tenant concurrency caps, and a maximum job budget.

### 3.4 Media object storage

**Preferred candidate: Cloudflare R2.**

Use it for:
- Uploaded source media.
- Generated images and video clips.
- Intermediate proxies.
- Audio stems and mix versions.
- 4K review files.
- Approved 8K/12K masters.
- Checksums and immutable delivery manifests.

Published Standard storage pricing:
- First 10 GB-month included.
- US$0.015 per GB-month thereafter.
- Class A and Class B operations have separate pricing.
- Internet egress is free.

The repository already includes the AWS S3 SDK at the root. R2 exposes an S3-compatible API, but Cloudflare documents API differences and unsupported operations. Test multipart uploads, presigned URLs, checksums, metadata, and large-file recovery before production use.

Never send large media files through the job queue. Queue messages should contain asset IDs, object keys, checksums, and job metadata only.

### 3.5 AI providers

**Text direction and planning:** retain the existing 9Router adapter for creative briefs, scripts, storyboards, and structured production plans. Its environment values are currently placeholders; connectivity is not verified.

**Video/image generation:** add a dedicated xAI Imagine adapter. Keep the API key server-side only. Record provider, model, request ID, job ID, timestamps, requested profile, actual output metadata, cost, and errors.

Published xAI Imagine capabilities at preparation time:
- Video 1.5: up to 1080p, with 480p, 720p, and 1080p output options.
- Video 1.5 pricing shown as US$0.08/sec at 480p, US$0.14/sec at 720p, and US$0.25/sec at 1080p.
- Video 1.5 Lite: up to 1080p, with 1080p shown at US$0.14/sec.
- Image generation models provide 1K/2K outputs depending on model.

Illustrative generation cost for 60 seconds:
- Video 1.5 at 1080p: approximately US$15.
- Video 1.5 at 720p: approximately US$8.40.
- Video 1.5 Lite at 1080p: approximately US$8.40.

These figures are provider generation charges only. They exclude retries, editing, audio, storage, GPU processing, taxes, and any other services.

**8K/12K rule:** xAI's published native video output is currently up to 1080p. Therefore, 8K/12K must be treated as a separate post-generation upscale/mastering stage, never as native xAI output. A target selection in the UI is not evidence of actual resolution.

### 3.6 GPU and media processing

**Preferred candidate for benchmark:** Runpod Serverless or equivalent on-demand GPU compute.

Use GPU only when a job requires:
- AI upscaling/restoration.
- GPU-accelerated compositing or enhancement.
- Heavy image/video processing.

Keep ordinary orchestration and database work on CPU infrastructure. Do not keep a high-cost GPU running 24/7.

Published Runpod Serverless reference rates at preparation time include:
- RTX 4090: approximately US$1.34/hour.
- L40S: approximately US$1.75/hour.
- H100: approximately US$5.39/hour.

These are compute-rate references, not a total render estimate. Benchmark a short representative clip and measure GPU runtime, memory, output quality, storage, and transfer before selecting a GPU. The FFmpeg worker should expose a controlled API and return actual media metadata and checksums.

### 3.7 Observability and Data Genius

Data Genius becomes the single operational evidence ledger.

Every event should include:
- event_id;
- correlation_id and job_id;
- tenant_id and actor_id;
- source and service;
- environment;
- event_type;
- timestamp in UTC;
- provider and model when applicable;
- requested and actual output properties;
- status and error class;
- estimated and actual cost where available;
- asset IDs and checksums;
- QA result and approval state.

Separate development, sandbox, and production events. Never insert predicted, demo, placeholder, or fabricated records into production dashboards.

Cloudflare Logs/Observability can supplement service logs if the Cloudflare services are selected. It does not replace the KJS business event schema.

---

## 4. Unified job lifecycle

Use one lifecycle across creative, engineering, store, and academy tasks:

`CREATED -> VALIDATED -> AWAITING_APPROVAL -> QUEUED -> RUNNING -> QA_PENDING -> SUCCEEDED`

Terminal alternatives:
- `FAILED`
- `CANCELLED`
- `BLOCKED`

For cinematic jobs, add explicit stages:
- `BRIEF_READY`
- `ASSETS_PENDING`
- `GENERATING`
- `POST_PROCESSING`
- `UPSCALE_PENDING`
- `AUDIO_MASTERING`
- `QA_PENDING`
- `APPROVED_MASTER`

Every transition must be persisted and auditable. A successful provider response is not a finished production. A finished file is not an approved master until QA and human approval are complete.

---

## 5. Frontend target

Extend the existing `/painel`; do not create a second dashboard.

Proposed top-level sections:
1. Command Center — health, queue, blockers, approvals, and recent verified events.
2. Sovereign Board — leadership roles, decision records, and escalation.
3. Agents — role, assigned work, actual state, last event, and evidence.
4. Board Academy — departments, curricula, competency assessments, and learning records.
5. Imperator Movie Ω — creative brief, generation jobs, assets, audio, upscale, QA, and master approval.
6. Store Intelligence — product catalog, checkout evidence, and sales metrics.
7. Data Genius — event explorer, cost ledger, anomalies, and audit history.
8. Engineering — code changes, CI status, deployment evidence, and service health.

Rules:
- Never show “autonomous”, “online”, “healthy”, “rendered”, or “deployed” based only on a static label.
- Statuses must come from the API and include last_updated timestamps.
- Show requested resolution separately from actual file dimensions.
- 8K and 12K are target profiles; 4K is a review/intermediate profile.
- Keep provider credentials out of the browser.
- Require consent and rights checks before any real-person likeness/voice asset is used.
- Require budget approval before expensive generation or GPU jobs.

---

## 6. Security and compliance gates

Before production:
- Replace shared creative bearer-token access with authenticated, scoped sessions and role-based authorization.
- Add tenant isolation to every job, asset, and event query.
- Add rate limits and abuse protection.
- Verify payment gateway webhook signatures before accepting financial events.
- Use idempotency keys for webhook ingestion and queue delivery.
- Store secrets only in the hosting secret manager.
- Use short-lived signed upload/download URLs for media.
- Restrict storage credentials to the required bucket and actions.
- Define retention, deletion, backup, and recovery policies.
- Record consent and rights evidence for likeness, voice, music, and source assets.
- Set per-job provider/GPU budget ceilings and global monthly alerts.

---

## 7. Implementation sequence

### Phase 0 — Approval and environment verification
- Confirm the active host and deployment owner.
- Confirm whether Turso and Cloudflare accounts already exist and which plans are active.
- Confirm whether the current repository branch is the approved working branch.
- No secrets are requested in chat; values are entered directly in the provider's secure secret manager.

### Phase 1 — Consolidation
- Keep the current Bun/Hono/Drizzle/Turso app as the primary application.
- Review and quarantine the hardcoded Agent Core demo pipeline.
- Define one job schema and one queue adapter.
- Add storage abstraction and asset metadata.
- Add the Data Genius event contract.

### Phase 2 — Backend execution
- Persist creative plans and jobs.
- Add queue dispatch, retries, DLQ, cancellation, and idempotency.
- Add 9Router and xAI adapters.
- Add FFmpeg/GPU worker adapter.
- Add R2 upload/download flow.
- Add callback and job-status endpoints.

### Phase 3 — Frontend command center
- Add the Command Center, Board, Agents, Academy, Movie, Store, Data Genius, and Engineering sections.
- Bind every status to real API data.
- Add approvals, cost estimates, and job controls.
- Keep demo data visibly segregated.

### Phase 4 — Verification
- Typecheck, lint, unit tests, integration tests, security tests, and production build.
- Test queue retry and dead-letter behavior.
- Test signed uploads and large media.
- Run a controlled short video job.
- Validate actual resolution, codec, frame rate, audio channels, checksums, and cost.
- Record all evidence in Data Genius.
- Only then consider a production release.

---

## 8. Approval decisions requested

Approve or amend these architectural decisions:

1. Keep Bun + Hono + Drizzle + Turso as the primary application stack.
2. Use Cloudflare R2 for media object storage, subject to S3-compatibility tests.
3. Choose one queue: QStash for simpler HTTP integration, or Cloudflare Queues for closer Cloudflare integration.
4. Use on-demand GPU workers; no permanent GPU instance.
5. Use 9Router for text planning and xAI Imagine as a separate media provider adapter.
6. Keep the existing runtime if it is active; otherwise compare one VPS before provisioning.
7. Do not activate the separate PostgreSQL/Celery Agent Core until its data model and demo pipeline are reconciled.
8. Do not merge to `main` or deploy production as part of this approval.

---

## 9. Evidence and references

Repository:
- [Imperator Movie UI](https://github.com/kamillosantos/KAMILLO-4531/blob/feat/kjs-imperator-movie-agent/packages/web/src/web/components/painel/imperator-movie.tsx)
- [Creative orchestrator API](https://github.com/kamillosantos/KAMILLO-4531/blob/feat/kjs-imperator-movie-agent/packages/web/src/api/creative-orchestrator.ts)
- [Cinematic Master Skill](https://github.com/kamillosantos/KAMILLO-4531/blob/feat/kjs-imperator-movie-agent/docs/skills/KJS_IMPERATOR_CINEMATIC_MASTER.md)

Official infrastructure references:
- [Turso pricing](https://turso.tech/pricing)
- [Cloudflare Workers pricing and Queues](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare Queues overview](https://developers.cloudflare.com/queues/)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare R2 S3 compatibility](https://developers.cloudflare.com/r2/api/s3/api/)
- [Upstash QStash pricing](https://upstash.com/pricing/qstash)
- [xAI Imagine overview](https://docs.x.ai/developers/model-capabilities/imagine)
- [xAI API pricing](https://docs.x.ai/developers/pricing)
- [Runpod GPU pricing](https://www.runpod.io/pricing)
- [Hetzner price adjustment](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/)
- [DigitalOcean Droplet pricing](https://www.digitalocean.com/pricing/droplets)

Prices and provider capabilities can change. Reconfirm them before any purchase or production activation.

---

## 10. Final governance status

This document records an architecture proposal, not an implementation.

- Repository inspected: YES.
- Existing code reused in the proposal: YES.
- Infrastructure providers researched: YES.
- New provider accounts created: NO.
- Secrets configured: NO.
- Production resources provisioned: NO.
- Application code changed: NO.
- Tests executed: NO.
- Deployment performed: NO.
- Owner approval: PENDING.

**KJS IMPERATOR Ω — Evidence before certification.**
