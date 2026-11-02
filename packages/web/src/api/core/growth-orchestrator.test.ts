import { describe, expect, test } from "bun:test";
import { evaluateGrowthTask } from "./growth-orchestrator";

const base = {
  id: "task-1",
  objective: "Analyze verified organic acquisition data",
  agent: "data-revops" as const,
  actionClass: "internal_read" as const,
  requiresHumanApproval: false,
  claims: [{ id: "dataset", statement: "Dataset was ingested", requiredEnvironment: "production" as const }],
  evidence: [{
    id: "ev-1", claimId: "dataset", source: "signed ingestion record",
    observedAt: new Date().toISOString(), environment: "production" as const, status: "VERIFIED" as const,
  }],
};

describe("KJS Growth Orchestrator", () => {
  test("allows a scoped internal task with verified evidence", () => {
    expect(evaluateGrowthTask(base).status).toBe("READY");
  });

  test("blocks external actions without human approval", () => {
    const result = evaluateGrowthTask({ ...base, actionClass: "external_publish", requiresHumanApproval: false });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasons).toContain("external_action_requires_human_approval");
  });

  test("blocks approval claims without an approval reference", () => {
    const result = evaluateGrowthTask({ ...base, actionClass: "financial", requiresHumanApproval: true });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasons).toContain("approval_reference_missing");
  });

  test("blocks claims without claim-specific evidence", () => {
    const result = evaluateGrowthTask({ ...base, evidence: [] });
    expect(result.status).toBe("BLOCKED");
  });
});
