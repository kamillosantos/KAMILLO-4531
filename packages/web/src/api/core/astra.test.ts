import { describe, expect, test } from "bun:test";
import { auditClaims } from "./astra";

const now = new Date("2026-11-02T00:00:00.000Z");
const claim = { id: "deploy", statement: "Deployment completed", requiredEnvironment: "production" as const };

describe("ASTRA evidence gate", () => {
  test("blocks a claim with no evidence", () => {
    const result = auditClaims({ claims: [claim], evidence: [], now });
    expect(result.decision).toBe("BLOCK");
    expect(result.results[0]?.reason).toBe("claim_has_no_evidence");
  });

  test("confirms only claim-specific, verified, production evidence", () => {
    const result = auditClaims({
      claims: [claim],
      evidence: [{ id: "ev-1", claimId: "deploy", source: "CI run URL", observedAt: "2026-11-01T23:00:00.000Z", environment: "production", status: "VERIFIED" }],
      now,
    });
    expect(result.decision).toBe("ALLOW");
    expect(result.summary.confirmed).toBe(1);
  });

  test("rejects evidence from another environment", () => {
    const result = auditClaims({
      claims: [claim],
      evidence: [{ id: "ev-2", claimId: "deploy", source: "test log", observedAt: "2026-11-01T23:00:00.000Z", environment: "test", status: "VERIFIED" }],
      now,
    });
    expect(result.decision).toBe("BLOCK");
    expect(result.results[0]?.reason).toBe("environment_mismatch");
  });

  test("does not allow pending evidence to certify a claim", () => {
    const result = auditClaims({
      claims: [claim],
      evidence: [{ id: "ev-3", claimId: "deploy", source: "manual note", observedAt: "2026-11-01T23:00:00.000Z", environment: "production", status: "PENDING" }],
      now,
    });
    expect(result.decision).toBe("BLOCK");
    expect(result.results[0]?.status).toBe("PENDING");
  });
});
