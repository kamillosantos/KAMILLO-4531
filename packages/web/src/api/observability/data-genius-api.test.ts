import { beforeAll, describe, expect, test } from "bun:test";

process.env.DATABASE_URL = "file::memory:";
process.env.DATA_GENIUS_INGEST_TOKEN = "test-ingest-token-longer-than-thirty-two-characters";
process.env.KJS_CRM_SESSION_SECRET = "test-crm-session-secret-longer-than-thirty-two-characters";

const [{ default: app }, { db }, { sql, eq }, { ecosystemEvents }, { createCrmSession }, { persistOperationalEvent }] = await Promise.all([
  import("../index"),
  import("../database"),
  import("drizzle-orm").then((module) => ({ sql: module.sql, eq: module.eq })),
  import("../database/schema").then((module) => ({ ecosystemEvents: module.ecosystemEvents })),
  import("../security/crm-session"),
  import("./persist-event"),
]);

const eventId = "f2a0d2c7-6f13-4f2d-9f1e-3a6d3e9a1c21";
const event = {
  event_id: eventId,
  event_type: "lead.created",
  schema_version: "1.0.0",
  occurred_at: "2026-11-03T12:00:00.000Z",
  source_system: "IMPRRSDOR",
  source_component: "event-outbox",
  source_version: "1.0.0",
  environment: "production",
  event_class: "OBSERVED",
  correlation_id: eventId,
  actor_type: "system",
  actor_id: "imperator-outbox",
  status: "DISPATCHED",
  payload: { lead_id: 101, source: "organic" },
};

beforeAll(async () => {
  await db.run(sql.raw(`
    CREATE TABLE ecosystem_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      event_id TEXT NOT NULL UNIQUE,
      event_type TEXT NOT NULL,
      schema_version TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      source_system TEXT NOT NULL,
      source_component TEXT NOT NULL,
      source_version TEXT NOT NULL,
      environment TEXT NOT NULL,
      event_class TEXT NOT NULL,
      correlation_id TEXT NOT NULL,
      actor_type TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      status TEXT NOT NULL,
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_at INTEGER NOT NULL
    )
  `));
});

describe("Data Genius ingest and query API", () => {
  test("persists CRM operational events without contact PII", async () => {
    const eventId = await persistOperationalEvent({
      event_type: "crm.lead.created",
      source_component: "crm",
      status: "LEAD_CREATED",
      payload: { lead_id: 42, stage: "T-04", source: "painel" },
    });
    const rows = await db.select().from(ecosystemEvents).where(eq(ecosystemEvents.eventId, eventId));
    expect(rows.length).toBe(1);
    expect(rows[0]?.eventType).toBe("crm.lead.created");
    expect(rows[0]?.payloadJson).not.toContain("email");
  });

  test("reports readiness only to an authenticated operator", async () => {
    const denied = await app.request("/api/observability/health");
    expect(denied.status).toBe(401);
    const session = createCrmSession(process.env.KJS_CRM_SESSION_SECRET!);
    const response = await app.request("/api/observability/health", {
      headers: { cookie: "kjs_crm_session=" + session },
    });
    expect(response.status).toBe(200);
    const result = await response.json() as { status: string; ledger: string; ingest: string };
    expect(result.status).toBe("READY");
    expect(result.ledger).toBe("READY");
    expect(result.ingest).toBe("CONFIGURED");
  });

  test("rejects unauthenticated producers", async () => {
    const response = await app.request("/api/observability/ingest", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
    });
    expect(response.status).toBe(401);
  });

  test("persists a valid event and acknowledges duplicate delivery idempotently", async () => {
    const headers = {
      authorization: "Bearer " + process.env.DATA_GENIUS_INGEST_TOKEN,
      "content-type": "application/json",
    };
    const first = await app.request("/api/observability/ingest", {
      method: "POST", headers, body: JSON.stringify(event),
    });
    expect(first.status).toBe(201);
    const second = await app.request("/api/observability/ingest", {
      method: "POST", headers, body: JSON.stringify(event),
    });
    expect(second.status).toBe(200);
    expect((await second.json()).duplicate).toBe(true);
  });

  test("exposes persisted rows only to an authenticated CRM operator", async () => {
    const denied = await app.request("/api/observability/events");
    expect(denied.status).toBe(401);
    const session = createCrmSession(process.env.KJS_CRM_SESSION_SECRET!);
    const response = await app.request("/api/observability/events", {
      headers: { cookie: "kjs_crm_session=" + session },
    });
    expect(response.status).toBe(200);
    const result = await response.json() as { count: number; events: Array<{ eventId: string; payload: unknown }> };
    expect(result.count).toBe(1);
    expect(result.events[0]?.eventId).toBe(eventId);
  });
});
