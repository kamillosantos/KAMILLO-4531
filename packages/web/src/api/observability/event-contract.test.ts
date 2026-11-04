import { describe, expect, test } from "bun:test";
import { validateKjsEvent, isProductionMetricEvent, assertKjsJobTransition } from "./event-contract";

const event = {
  event_id: "evt_1", event_type: "cinema.plan.created", schema_version: "1.0.0",
  occurred_at: "2026-11-03T12:00:00.000Z", source_system: "KAMILLO-4531",
  source_component: "test", source_version: "1.0.0", environment: "production" as const,
  event_class: "OBSERVED" as const, correlation_id: "corr_1", actor_type: "service" as const,
  actor_id: "test", status: "RECORDED", payload: { request_id: "req_1" },
};

describe("KJS event contract", () => {
  test("accepts provenance-complete observed production event", () => {
    expect(validateKjsEvent(event)).toEqual([]);
    expect(isProductionMetricEvent(event)).toBe(true);
  });
  test("rejects secret-bearing payload and non-observed production metrics", () => {
    expect(validateKjsEvent({ ...event, payload: { api_token: "x" } })).toContain("SECRET_KEY_IN_PAYLOAD");
    expect(isProductionMetricEvent({ ...event, event_class: "PREDICTED" })).toBe(false);
  });
  test("requires QA evidence before a job can succeed", () => {
    expect(() => assertKjsJobTransition("QA_PENDING", "SUCCEEDED")).toThrow("QA_EVIDENCE_REQUIRED");
    expect(() => assertKjsJobTransition("CREATED", "SUCCEEDED")).toThrow("ILLEGAL_JOB_TRANSITION");
    expect(() => assertKjsJobTransition("QA_PENDING", "SUCCEEDED", { qa_passed: true })).not.toThrow();
  });
});
