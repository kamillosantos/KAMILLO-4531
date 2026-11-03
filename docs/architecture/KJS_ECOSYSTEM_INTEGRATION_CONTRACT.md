# KJS IMPERATOR Ω — Cross-Repository Integration Contract

**Status:** CONTRACT_BASELINE / NOT_CERTIFIED  
**Target branch:** `feat/kjs-ecosystem-consolidation`  
**Application plane:** KAMILLO-4531 / Cloud  
**Control plane:** IMPRRSDOR

## 1. Ownership boundaries

KAMILLO-4531 owns the user-facing application, product modules, CRM/inbox experience, Cinema workflows, media assets, and specialized execution adapters. IMPRRSDOR owns central governance, policy decisions, skill/context registry, orchestration policy, and cross-ecosystem intelligence.

The two repositories remain separate. No blind merge, history rewrite, second primary database, or parallel hosting stack is introduced by this contract.

## 2. Global event stream

The Cloud application emits versioned operational events to the Data Genius event interface. Event payloads must carry:
- unique `event_id`;
- namespaced `event_type` and schema version;
- UTC `occurred_at`;
- `source_system=KAMILLO-4531`, component, and source version;
- environment and tenant scope;
- correlation/causation IDs;
- actor type and non-secret actor ID;
- observed status and evidence/trace reference.

Use the event classes `OBSERVED`, `TEST`, `PREDICTED`, and `SYNTHETIC`. Only `OBSERVED` production events may feed production operational metrics. UI counters must be computed from persisted, authorized event records, never from hardcoded examples or optimistic placeholders.

## 3. Event categories

Initial event namespaces:
- `repo.commit.created`, `repo.branch.updated`, `repo.check.completed`
- `agent.job.created`, `agent.job.started`, `agent.job.completed`, `agent.job.failed`, `agent.job.cancelled`
- `llm.request.started`, `llm.request.completed`, `llm.request.failed`
- `crm.conversation.created`, `crm.message.received`, `crm.message.sent`
- `cinema.project.created`, `cinema.asset.ingested`, `cinema.render.started`, `cinema.render.completed`, `cinema.qa.completed`
- `library.asset.published`, `library.asset.accessed`
- `security.webhook.rejected`, `security.authorization.denied`

These names define the contract only. Do not emit events for actions that have not occurred.

## 4. Context and design lock

- Keep the existing approved visual language and page composition.
- Introduce design tokens and a context manifest before broad UI refactoring.
- A functional bug fix may change only the necessary component, API contract, tests, and directly related styles.
- Any unrelated visual change requires an explicit design decision and updated screenshot baseline.
- Every implementation task records protected files, acceptance criteria, test evidence, and rollback instructions.
- Never infer product behavior from screenshots alone; reconcile screenshots with source, API, schema, and existing behavior.

## 5. Cloud agent execution

The existing Agent Core must be treated as a separate execution prototype until its database, broker, worker, authentication, and API are proven connected to the application. Do not introduce it as a second source of truth. The application database and current runtime remain authoritative until an explicit migration and ownership decision is approved.

Jobs must have durable IDs, tenant scope, actor, timestamps, correlation IDs, bounded retries, timeouts, cancellation, and auditable state transitions. `QUEUED` is not `COMPLETED`.

## 6. CRM / agency services

The current CRM assistant is documented as deterministic/rule-based, not a connected LLM. Preserve that distinction in UI and telemetry. LLM-backed SDR/closer workflows require provider adapters, approved context, evaluation datasets, human review for outbound actions, opt-in/opt-out handling, and traceable conversation records.

## 7. Cinema / media pipeline

Separate creative planning from provider submission, asset ingestion, render, upscale/master, audio processing, and final QA. Record actual dimensions, codec, frame rate, bit depth, color space, audio layout, checksums, and rights/review state. Never label a project as an approved 8K/12K master or surround deliverable without measured evidence.

## 8. Library / free distribution

The Drive de Pobre is a free-access library within the portal. The library catalog, access policy, asset provenance, license/rights, version, and distribution events must be modeled separately from paid products. Do not add a price to free library assets or imply that access is paid.

## 9. Release gate

No production release until:
- automated build/typecheck/lint/tests pass;
- API authorization and tenant isolation are verified;
- webhook signatures and idempotency are tested;
- event stream provenance is verified end-to-end;
- visual regression passes against approved baselines;
- external providers and background workers are tested with real integrations;
- rollback and owner approval are recorded.

**Release state:** `NOT_CERTIFIED`. This contract does not itself implement these capabilities or authorize production deployment.
