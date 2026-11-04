import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";

// ── Institutional site + CRM (B2B Belgos AI Kanban) ────────────────
// `leads` powers both the public site capture (quiz/garimpo/contact) and
// the B2B demand engine Kanban. Stages follow #KamilloSantosProtocol:
// T-04 Prospecção → T-03 Qualificado → T-02 Onboarding → T-01 Cliente.
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  company: text("company"),
  service: text("service"),
  message: text("message"),
  source: text("source").notNull().default("site"),
  // CRM / Kanban fields
  stage: text("stage").notNull().default("T-04"),
  score: integer("score").notNull().default(0),
  ltvPredicted: real("ltv_predicted").notNull().default(0),
  owner: text("owner"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── B2C Infoproduct engine (101X funnel + gateway webhooks) ─────────
// Records every purchase event across gateways (Hotmart, Kiwify,
// ClickBank, BuyGoods, Eduzz, Monetizze). offerType maps the 101X
// funnel position: tripwire / order_bump / upsell / downsell / main.
export const checkouts = sqliteTable("checkouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gateway: text("gateway").notNull(),
  transactionId: text("transaction_id"),
  product: text("product").notNull(),
  offerType: text("offer_type").notNull().default("main"),
  buyerName: text("buyer_name"),
  buyerEmail: text("buyer_email"),
  amount: real("amount").notNull().default(0),
  currency: text("currency").notNull().default("BRL"),
  status: text("status").notNull().default("pending"),
  idempotencyKey: text("idempotency_key").unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => ({
  gatewayTransactionUnique: uniqueIndex("checkouts_gateway_transaction_id_uq")
    .on(table.gateway, table.transactionId),
}));

// ── RevOps / Neural bidding governance ─────────────────────────────
export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  channel: text("channel").notNull().default("Meta Ads"),
  objective: text("objective"),
  spend: real("spend").notNull().default(0),
  revenue: real("revenue").notNull().default(0),
  roasTarget: real("roas_target").notNull().default(3),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Roboavaliador Pre-Flight (deliverability audit) ────────────────
export const preflightChecks = sqliteTable("preflight_checks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  domain: text("domain").notNull(),
  spf: integer("spf", { mode: "boolean" }).notNull().default(false),
  dkim: integer("dkim", { mode: "boolean" }).notNull().default(false),
  dmarc: integer("dmarc", { mode: "boolean" }).notNull().default(false),
  spamScore: real("spam_score").notNull().default(0),
  trackingOk: integer("tracking_ok", { mode: "boolean" })
    .notNull()
    .default(false),
  verdict: text("verdict").notNull().default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── RevOps / Governance / LGPD audit trail ─────────────────────────
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  actor: text("actor").notNull().default("system"),
  details: text("details"),
  complianceFlag: text("compliance_flag").notNull().default("ok"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ── Kamillo Dev Engine (BRADATA-grade software architecture runs) ──
export const devEngineRuns = sqliteTable("dev_engine_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectName: text("project_name").notNull(),
  architectureType: text("architecture_type").notNull().default("MICROSERVICES"),
  securityLevel: text("security_level").notNull().default("STANDARD"),
  customFeatures: text("custom_features").notNull().default("[]"),
  apiFirstReady: integer("api_first_ready", { mode: "boolean" })
    .notNull()
    .default(true),
  securityAudit: text("security_audit").notNull().default("STANDARD"),
  signature: text("signature").notNull().default("BRADATA_SOFTWARE_HOUSE_VERIFIED"),
  status: text("status").notNull().default("SYSTEM_ARCHITECTED"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});


// ── KJS CRM Inbox — persistent conversations and message history ───
export const crmConversations = sqliteTable("crm_conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactName: text("contact_name").notNull(),
  contact: text("contact").notNull(),
  channel: text("channel").notNull().default("web"),
  consentRecorded: integer("consent_recorded", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("bot"),
  assignedTo: text("assigned_to"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const crmMessages = sqliteTable("crm_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => crmConversations.id, { onDelete: "cascade" }),
  direction: text("direction").notNull(),
  senderType: text("sender_type").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});


// ── Data Genius — append-only operational event ledger ─────────────
export const ecosystemEvents = sqliteTable("ecosystem_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: text("event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  schemaVersion: text("schema_version").notNull(),
  occurredAt: text("occurred_at").notNull(),
  sourceSystem: text("source_system").notNull(),
  sourceComponent: text("source_component").notNull(),
  sourceVersion: text("source_version").notNull(),
  environment: text("environment").notNull(),
  eventClass: text("event_class").notNull(),
  correlationId: text("correlation_id").notNull(),
  actorType: text("actor_type").notNull(),
  actorId: text("actor_id").notNull(),
  status: text("status").notNull(),
  payloadJson: text("payload_json").notNull().default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
