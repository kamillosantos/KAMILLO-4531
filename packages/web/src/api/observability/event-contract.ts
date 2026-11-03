export type KjsEnvironment = "development" | "staging" | "production";
export type KjsEventClass = "OBSERVED" | "TEST" | "PREDICTED" | "SYNTHETIC";
export type KjsJobState =
  | "CREATED" | "VALIDATED" | "AWAITING_APPROVAL" | "QUEUED" | "RUNNING"
  | "QA_PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "BLOCKED" | "EXPIRED";

export type KjsOperationalEvent = {
  event_id: string;
  event_type: string;
  schema_version: string;
  occurred_at: string;
  source_system: string;
  source_component: string;
  source_version: string;
  environment: KjsEnvironment;
  event_class: KjsEventClass;
  correlation_id: string;
  causation_id?: string;
  actor_type: "human" | "service" | "agent" | "system";
  actor_id: string;
  tenant_id?: string;
  status: string;
  evidence_ref?: string;
  payload?: Record<string, unknown>;
};

const secretKey = /(password|passwd|secret|token|authorization|api[_-]?key|private[_-]?key|cookie|cvv)/i;
const transitions: Record<KjsJobState, KjsJobState[]> = {
  CREATED: ["VALIDATED", "BLOCKED", "CANCELLED"],
  VALIDATED: ["AWAITING_APPROVAL", "QUEUED", "BLOCKED", "CANCELLED"],
  AWAITING_APPROVAL: ["QUEUED", "BLOCKED", "CANCELLED", "EXPIRED"],
  QUEUED: ["RUNNING", "BLOCKED", "CANCELLED", "EXPIRED"],
  RUNNING: ["QA_PENDING", "FAILED", "CANCELLED", "BLOCKED"],
  QA_PENDING: ["SUCCEEDED", "FAILED", "CANCELLED", "BLOCKED"],
  SUCCEEDED: [], FAILED: [], CANCELLED: [], BLOCKED: [], EXPIRED: [],
};

function containsSecretKey(value: unknown, depth = 0): boolean {
  if (depth > 8 || value === null || typeof value !== "object") return false;
  for (const [key, child] of Object.entries(value)) {
    if (secretKey.test(key) || containsSecretKey(child, depth + 1)) return true;
  }
  return false;
}

export function validateKjsEvent(event: KjsOperationalEvent): string[] {
  const errors: string[] = [];
  const required: Array<keyof KjsOperationalEvent> = [
    "event_id", "event_type", "schema_version", "occurred_at", "source_system",
    "source_component", "source_version", "environment", "event_class",
    "correlation_id", "actor_type", "actor_id", "status",
  ];
  for (const key of required) {
    if (typeof event?.[key] !== "string" || !String(event[key]).trim()) errors.push(`REQUIRED_${String(key).toUpperCase()}`);
  }
  if (event?.schema_version && !/^\d+\.\d+\.\d+$/.test(event.schema_version)) errors.push("INVALID_SCHEMA_VERSION");
  if (event?.occurred_at && (!Number.isFinite(Date.parse(event.occurred_at)) || !/^\d{4}-\d\d-\d\dT.*Z$/.test(event.occurred_at))) errors.push("TIMESTAMP_MUST_BE_UTC");
  if (event?.environment && !["development", "staging", "production"].includes(event.environment)) errors.push("INVALID_ENVIRONMENT");
  if (event?.event_class && !["OBSERVED", "TEST", "PREDICTED", "SYNTHETIC"].includes(event.event_class)) errors.push("INVALID_EVENT_CLASS");
  if (event?.environment === "production" && !["OBSERVED", "TEST"].includes(event.event_class)) errors.push("NON_OBSERVED_PRODUCTION_EVENT");
  if (event?.event_class === "PREDICTED" && !["PREDICTED", "PLANNED"].includes(event.status)) errors.push("PREDICTION_CANNOT_BE_COMPLETED");
  if (event?.payload && (Array.isArray(event.payload) || typeof event.payload !== "object")) errors.push("PAYLOAD_MUST_BE_OBJECT");
  if (containsSecretKey(event?.payload)) errors.push("SECRET_KEY_IN_PAYLOAD");
  return errors;
}

export function createObservedEvent(input: {
  event_type: string;
  source_component: string;
  correlation_id: string;
  status: string;
  actor_id: string;
  payload?: Record<string, unknown>;
}): KjsOperationalEvent {
  const event: KjsOperationalEvent = {
    event_id: crypto.randomUUID(),
    event_type: input.event_type,
    schema_version: "1.0.0",
    occurred_at: new Date().toISOString(),
    source_system: "KAMILLO-4531",
    source_component: input.source_component,
    source_version: process.env.npm_package_version || "unreleased",
    environment: (["development", "staging", "production"].includes(process.env.NODE_ENV || "")
      ? process.env.NODE_ENV
      : "development") as KjsEnvironment,
    event_class: "OBSERVED",
    correlation_id: input.correlation_id,
    actor_type: "service",
    actor_id: input.actor_id,
    status: input.status,
    payload: input.payload,
  };
  const errors = validateKjsEvent(event);
  if (errors.length) throw new Error(`INVALID_KJS_EVENT:${errors.join(",")}`);
  return event;
}

export function isProductionMetricEvent(event: KjsOperationalEvent): boolean {
  return validateKjsEvent(event).length === 0 &&
    event.environment === "production" && event.event_class === "OBSERVED";
}

export function canTransitionKjsJob(from: KjsJobState, to: KjsJobState): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function assertKjsJobTransition(
  from: KjsJobState,
  to: KjsJobState,
  evidence: { qa_passed?: boolean; approval_required?: boolean; approved?: boolean } = {},
): void {
  if (!canTransitionKjsJob(from, to)) throw new Error(`ILLEGAL_JOB_TRANSITION:${from}->${to}`);
  if (to === "SUCCEEDED" && evidence.qa_passed !== true) throw new Error("QA_EVIDENCE_REQUIRED");
  if (["QUEUED", "RUNNING", "QA_PENDING", "SUCCEEDED"].includes(to) &&
      evidence.approval_required === true && evidence.approved !== true) {
    throw new Error("HUMAN_APPROVAL_REQUIRED");
  }
}
