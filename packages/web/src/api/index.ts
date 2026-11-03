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

// Generic gateway webhook is intentionally fail-closed.
// Provider-specific signature verification and event normalization must be
// implemented before any external event can affect the checkout ledger.
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
    return c.json({ error: "unknown_gateway" }, 404);
  }

  return c.json(
    {
      error: "webhook_ingestion_disabled",
      reason: "provider_signature_verification_not_configured",
      gateway: slug,
    },
    503,
  );
});

export default app;
