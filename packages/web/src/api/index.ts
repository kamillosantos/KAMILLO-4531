import type { RouterClient } from "@orpc/server";
import { desc, eq, and } from "drizzle-orm";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { leads } from "./routes/leads";
import { crm } from "./routes/crm";
import { checkouts } from "./routes/checkouts";
import { campaigns } from "./routes/campaigns";
import { preflight } from "./routes/preflight";
import { audit } from "./routes/audit";
import { devEngine } from "./routes/dev-engine";
import { inbox } from "./routes/inbox";
import { createCrmSession, hasCrmSession, passwordsMatch } from "./security/crm-session";
import { verifyGatewaySignature, getGatewayTransactionId, gatewayIdempotencyKey } from "./security/gateway-webhook";
import { mountCreativeOrchestrator } from "./creative-orchestrator";
import { validateKjsEvent, type KjsOperationalEvent } from "./observability/event-contract";
import { persistOperationalEvent } from "./observability/persist-event";
import { db } from "./database";
import * as schema from "./database/schema";

// API features are oRPC procedures, one file per feature in ./routes/,
// composed into this router — typed end-to-end via the clients
// (web: src/web/lib/api.ts, mobile: lib/api.ts).
// Keep each routes/ file under 500 lines (`bun run lint` enforces this);
// split into more feature files as they grow.
// Patterns and examples: skills/app/references/api.md
export const router = {
  ping,
  leads,
  crm,
  checkouts,
  campaigns,
  preflight,
  audit,
  devEngine,
  inbox,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);
mountCreativeOrchestrator(app);

// Private CRM operator session. Configure both secrets in the server environment.
const loginAttempts = new Map<string, { count: number; since: number }>();
app.post("/api/crm/session", async (c) => {
  const password = process.env.KJS_CRM_ADMIN_PASSWORD;
  const secret = process.env.KJS_CRM_SESSION_SECRET;
  if (!password || !secret || secret.length < 32) {
    return c.json({ error: "CRM não configurado: defina KJS_CRM_ADMIN_PASSWORD e KJS_CRM_SESSION_SECRET." }, 503);
  }
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (attempt && now - attempt.since < 15 * 60_000 && attempt.count >= 5) return c.json({ error: "Muitas tentativas. Aguarde 15 minutos." }, 429);
  let body: { password?: string } = {};
  try { body = await c.req.json(); } catch { /* invalid body */ }
  if (typeof body.password !== "string" || !passwordsMatch(body.password, password)) {
    const next = !attempt || now - attempt.since >= 15 * 60_000 ? { count: 1, since: now } : { count: attempt.count + 1, since: attempt.since };
    loginAttempts.set(ip, next);
    return c.json({ error: "Credenciais inválidas." }, 401);
  }
  loginAttempts.delete(ip);
  const token = createCrmSession(secret);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  c.header("Set-Cookie", "kjs_crm_session=" + token + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200" + secure);
  c.header("Cache-Control", "no-store");
  return c.json({ authenticated: true });
});
app.get("/api/crm/session", (c) => {
  c.header("Cache-Control", "no-store");
  return c.json({ authenticated: hasCrmSession(c.req.raw.headers) });
});
// Protected readiness probe distinguishes missing schema from missing producer configuration.
app.get("/api/observability/health", async (c) => {
  c.header("Cache-Control", "no-store");
  if (!hasCrmSession(c.req.raw.headers)) return c.json({ error: "UNAUTHORIZED" }, 401);
  const ingestConfigured = Boolean(process.env.DATA_GENIUS_INGEST_TOKEN && process.env.DATA_GENIUS_INGEST_TOKEN.length >= 32);
  try {
    await db.select({ eventId: schema.ecosystemEvents.eventId }).from(schema.ecosystemEvents).limit(1);
    return c.json({
      status: "READY",
      ledger: "READY",
      ingest: ingestConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
      receiver: "KAMILLO-4531",
    });
  } catch {
    return c.json({
      status: "BLOCKED",
      ledger: "MIGRATION_REQUIRED",
      ingest: ingestConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
      action: "Apply packages/web/migrations/0001_data_genius.sql",
    }, 503);
  }
});

// Cross-repository Data Genius ingestion. Producers must send a complete, validated event.
function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

app.post("/api/observability/ingest", async (c) => {
  const secret = process.env.DATA_GENIUS_INGEST_TOKEN;
  if (!secret || secret.length < 32) return c.json({ error: "INGEST_NOT_CONFIGURED" }, 503);
  const authorization = c.req.header("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!constantTimeEqual(supplied, secret)) return c.json({ error: "UNAUTHORIZED" }, 401);
  const raw = await c.req.text();
  if (raw.length > 48_000) return c.json({ error: "PAYLOAD_TOO_LARGE" }, 413);
  let event: KjsOperationalEvent;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return c.json({ error: "INVALID_EVENT" }, 400);
    event = parsed as KjsOperationalEvent;
  } catch {
    return c.json({ error: "INVALID_JSON" }, 400);
  }
  const errors = validateKjsEvent(event);
  if (errors.length) return c.json({ error: "EVENT_VALIDATION_FAILED", details: errors }, 400);
  try {
    const inserted = await db.insert(schema.ecosystemEvents).values({
      eventId: event.event_id, eventType: event.event_type, schemaVersion: event.schema_version,
      occurredAt: event.occurred_at, sourceSystem: event.source_system,
      sourceComponent: event.source_component, sourceVersion: event.source_version,
      environment: event.environment, eventClass: event.event_class,
      correlationId: event.correlation_id, actorType: event.actor_type,
      actorId: event.actor_id, status: event.status,
      payloadJson: JSON.stringify(event.payload || {}),
    }).onConflictDoNothing({ target: schema.ecosystemEvents.eventId })
      .returning({ eventId: schema.ecosystemEvents.eventId });
    if (inserted.length === 0) return c.json({ accepted: true, duplicate: true, event_id: event.event_id }, 200);
    return c.json({ accepted: true, event_id: event.event_id }, 201);
  } catch {
    return c.json({ error: "EVENT_PERSISTENCE_FAILED" }, 500);
  }
});

// Data Genius read API — authenticated CRM operator only. No synthetic rows are generated.
app.get("/api/observability/events", async (c) => {
  c.header("Cache-Control", "no-store");
  if (!hasCrmSession(c.req.raw.headers)) return c.json({ error: "UNAUTHORIZED" }, 401);
  const requestedLimit = Number(c.req.query("limit") || 100);
  const limit = Number.isFinite(requestedLimit) ? Math.min(200, Math.max(1, Math.floor(requestedLimit))) : 100;
  const environment = c.req.query("environment");
  const eventClass = c.req.query("event_class");
  if (environment && !["development", "staging", "production"].includes(environment)) return c.json({ error: "INVALID_ENVIRONMENT" }, 400);
  if (eventClass && !["OBSERVED", "TEST", "PREDICTED", "SYNTHETIC"].includes(eventClass)) return c.json({ error: "INVALID_EVENT_CLASS" }, 400);
  const filters = [];
  if (environment) filters.push(eq(schema.ecosystemEvents.environment, environment));
  if (eventClass) filters.push(eq(schema.ecosystemEvents.eventClass, eventClass));
  const query = db.select().from(schema.ecosystemEvents);
  const rows = await (filters.length ? query.where(and(...filters)) : query)
    .orderBy(desc(schema.ecosystemEvents.createdAt)).limit(limit);
  return c.json({
    source: "KAMILLO-4531_DATABASE",
    evidence_class: "PERSISTED_RECORDS_ONLY",
    count: rows.length,
    events: rows.map((row) => ({ ...row, payload: (() => { try { return JSON.parse(row.payloadJson); } catch { return {}; } })() })),
    integrations_not_instrumented: ["IMPRRSDOR", "CRM_LLM", "WHATSAPP_CLOUD_API", "MEDIA_RENDER_WORKERS", "EXTERNAL_REPOSITORIES"],
  });
});

app.delete("/api/crm/session", (c) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  c.header("Set-Cookie", "kjs_crm_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0" + secure);
  return c.json({ authenticated: false });
});


// ── Signed gateway webhook ingestion (B2C engine) ────────────────────
const GATEWAY_SLUGS = ["hotmart", "kiwify", "clickbank", "buygoods", "eduzz", "monetizze"] as const;



app.post("/api/webhooks/:gateway", async (c) => {
  const slug = c.req.param("gateway").toLowerCase();
  if (!GATEWAY_SLUGS.includes(slug as (typeof GATEWAY_SLUGS)[number])) {
    return c.json({ error: "unknown gateway" }, 404);
  }

  const secretName = `KJS_${slug.toUpperCase()}_WEBHOOK_SECRET`;
  const secret = process.env[secretName] || process.env.KJS_WEBHOOK_SHARED_SECRET;
  if (!secret || secret.length < 32) {
    return c.json({ error: "webhook integration is not configured; event rejected" }, 503);
  }

  const rawBody = await c.req.text();
  if (rawBody.length > 64_000) return c.json({ error: "payload too large" }, 413);
  const signature = c.req.header("x-kjs-signature") || "";
  if (!(await verifyGatewaySignature(rawBody, signature, secret))) {
    return c.json({ error: "invalid webhook signature" }, 401);
  }

  const transactionId = getGatewayTransactionId(body.transaction_id ?? body.transactionId);
  if (!transactionId) return c.json({ error: "valid transaction_id required" }, 400);
  const idem = gatewayIdempotencyKey(slug, transactionId);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return c.json({ error: "invalid payload" }, 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return c.json({ error: "invalid JSON" }, 400);
  }

  const product = String(body.product ?? body.product_name ?? "").trim();
  const amount = Number(body.amount ?? body.value);
  const currency = String(body.currency ?? "BRL").toUpperCase();
  const status = String(body.status ?? "").toLowerCase();
  const allowedStatuses = ["approved", "paid", "refunded", "chargeback", "cancelled", "pending"];
  if (!product || product.length > 240 || !Number.isFinite(amount) || amount <= 0 ||
      !/^[A-Z]{3}$/.test(currency) || !allowedStatuses.includes(status)) {
    return c.json({ error: "invalid purchase fields" }, 400);
  }

  const gatewayName = slug.charAt(0).toUpperCase() + slug.slice(1);
  try {
    const [row] = await db.insert(schema.checkouts).values({
      gateway: gatewayName,
      transactionId,
      product,
      offerType: String(body.offer_type ?? body.offerType ?? "main").slice(0, 80),
      buyerName: body.buyer_name ? String(body.buyer_name).slice(0, 180) : undefined,
      buyerEmail: body.buyer_email ? String(body.buyer_email).slice(0, 254) : undefined,
      amount,
      currency,
      status,
      idempotencyKey: idem,
    }).returning();

    await db.insert(schema.auditLogs).values({
      action: "webhook_ingest",
      entity: "checkout",
      entityId: String(row.id),
      actor: gatewayName,
      details: JSON.stringify({ signature_verified: true, idempotency_key: idem }),
    });
    await persistOperationalEvent({
      event_type: "checkout.webhook.received",
      source_component: "payment-webhook",
      status: "PAYMENT_" + status.toUpperCase(),
      payload: { checkout_id: row.id, gateway: gatewayName, payment_status: status, amount, currency },
    });
    return c.json({ received: true, id: row.id }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/unique|constraint|duplicate/i.test(message)) return c.json({ received: true, duplicate: true }, 200);
    return c.json({ error: "webhook persistence failed" }, 500);
  }
});

export default app;
