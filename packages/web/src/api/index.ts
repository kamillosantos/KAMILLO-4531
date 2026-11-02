import type { RouterClient } from "@orpc/server";
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
import { mountCreativeOrchestrator } from "./creative-orchestrator";
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
app.delete("/api/crm/session", (c) => {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  c.header("Set-Cookie", "kjs_crm_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0" + secure);
  return c.json({ authenticated: false });
});


// ── Gateway webhook ingestion (B2C engine) ─────────────────────────
// External infoproduct gateways POST purchase events here. Idempotent
// on x-idempotency-key. Records land in the checkouts ledger and are
// surfaced live in /painel → B2C module.
const GATEWAY_SLUGS = [
  "hotmart",
  "kiwify",
  "clickbank",
  "buygoods",
  "eduzz",
  "monetizze",
] as const;

app.post("/api/webhooks/:gateway", async (c) => {
  const slug = c.req.param("gateway").toLowerCase();
  if (!GATEWAY_SLUGS.includes(slug as (typeof GATEWAY_SLUGS)[number])) {
    return c.json({ error: "unknown gateway" }, 404);
  }
  let body: Record<string, unknown> = {};
  try {
    body = await c.req.json();
  } catch {
    body = {};
  }
  const idem =
    c.req.header("x-idempotency-key") || `${slug}_${Date.now()}`;

  const gatewayName = slug.charAt(0).toUpperCase() + slug.slice(1);
  try {
    const [row] = await db
      .insert(schema.checkouts)
      .values({
        gateway: gatewayName,
        product: String(body.product ?? body.product_name ?? "Produto"),
        offerType: String(body.offer_type ?? body.offerType ?? "main"),
        buyerName: body.buyer_name ? String(body.buyer_name) : undefined,
        buyerEmail: body.buyer_email ? String(body.buyer_email) : undefined,
        amount: Number(body.amount ?? body.value ?? 0),
        currency: String(body.currency ?? "BRL"),
        status: String(body.status ?? "approved"),
        idempotencyKey: idem,
      })
      .returning();
    await db.insert(schema.auditLogs).values({
      action: "webhook_ingest",
      entity: "checkout",
      entityId: String(row.id),
      actor: gatewayName,
      details: `Webhook ${gatewayName} recebido`,
    });
    return c.json({ received: true, id: row.id }, 200);
  } catch {
    // duplicate idempotency key — already processed
    return c.json({ received: true, duplicate: true }, 200);
  }
});

export default app;
