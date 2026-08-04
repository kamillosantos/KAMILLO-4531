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
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);

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
