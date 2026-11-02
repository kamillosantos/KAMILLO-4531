import { auditClaims, type Evidence, type Claim, type AuditResult } from "./astra";

export const AGENTS = [
  "market-intelligence",
  "growth-strategy",
  "content-engine",
  "conversion-engine",
  "retention-engine",
  "data-revops",
] as const;
export type AgentId = (typeof AGENTS)[number];
export type TaskStatus = "PROPOSED" | "READY" | "BLOCKED" | "COMPLETED";
export type ActionClass = "internal_read" | "internal_write" | "external_publish" | "external_message" | "financial";

export interface GrowthTask {
  id: string;
  objective: string;
  agent: AgentId;
  actionClass: ActionClass;
  requiresHumanApproval: boolean;
  approvalId?: string;
  claims: Claim[];
  evidence: Evidence[];
}

export interface TaskDecision {
  taskId: string;
  status: TaskStatus;
  reasons: string[];
  evidenceAudit: AuditResult;
}

const EXTERNAL_ACTIONS = new Set<ActionClass>(["external_publish", "external_message", "financial"]);

export function evaluateGrowthTask(task: GrowthTask): TaskDecision {
  const reasons: string[] = [];
  if (!task.id.trim() || !task.objective.trim()) reasons.push("task_identity_or_objective_missing");
  if (!AGENTS.includes(task.agent)) reasons.push("agent_not_allowlisted");

  const external = EXTERNAL_ACTIONS.has(task.actionClass);
  if (external && !task.requiresHumanApproval) reasons.push("external_action_requires_human_approval");
  if (external && task.requiresHumanApproval && !task.approvalId?.trim()) {
    reasons.push("approval_reference_missing");
  }

  const evidenceAudit = auditClaims({ claims: task.claims, evidence: task.evidence });
  if (evidenceAudit.decision !== "ALLOW") reasons.push("evidence_gate_blocked");

  const status: TaskStatus =
    reasons.length > 0 ? "BLOCKED" :
    task.claims.length > 0 ? "READY" : "PROPOSED";

  return { taskId: task.id, status, reasons, evidenceAudit };
}

/** A completed task requires a fresh second evaluation and explicit execution evidence. */
export function certifyTaskCompletion(task: GrowthTask, completionEvidence: Evidence[]): TaskDecision {
  const combined: GrowthTask = { ...task, claims: [
    ...task.claims,
    { id: `completion:${task.id}`, statement: "Task execution completed", requiredEnvironment: "production" },
  ], evidence: [...task.evidence, ...completionEvidence] };
  return evaluateGrowthTask(combined);
}
