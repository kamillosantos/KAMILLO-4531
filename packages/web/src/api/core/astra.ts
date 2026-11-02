/**
 * ASTRA — deterministic evidence and release-governance gate.
 * A claim is accepted only when its own evidence is present, traceable,
 * environment-scoped, fresh, and explicitly verified.
 */
export type EvidenceStatus = "VERIFIED" | "PENDING" | "REJECTED";
export type Environment = "production" | "staging" | "development" | "test";

export interface Evidence {
  id: string;
  claimId: string;
  source: string;
  observedAt: string;
  environment: Environment;
  status: EvidenceStatus;
  digest?: string;
}

export interface Claim {
  id: string;
  statement: string;
  requiredEnvironment?: Environment;
  maxAgeMs?: number;
}

export interface ClaimResult {
  claimId: string;
  status: "CONFIRMED" | "PENDING" | "BLOCKED";
  reason: string;
  evidenceIds: string[];
}

export interface AuditInput {
  claims: Claim[];
  evidence: Evidence[];
  now?: Date;
}

export interface AuditResult {
  decision: "ALLOW" | "BLOCK";
  results: ClaimResult[];
  summary: {
    total: number;
    confirmed: number;
    pending: number;
    blocked: number;
  };
}

const DEFAULT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function validEvidence(e: Evidence, claim: Claim, now: Date): string | null {
  if (!e.id.trim() || !e.claimId.trim() || !e.source.trim()) return "missing_identity_or_source";
  const observed = Date.parse(e.observedAt);
  if (!Number.isFinite(observed)) return "invalid_timestamp";
  if (observed > now.getTime()) return "future_timestamp";
  if (claim.requiredEnvironment && e.environment !== claim.requiredEnvironment) {
    return "environment_mismatch";
  }
  if (now.getTime() - observed > (claim.maxAgeMs ?? DEFAULT_MAX_AGE_MS)) {
    return "evidence_expired";
  }
  if (e.status !== "VERIFIED") return "evidence_not_verified";
  return null;
}

export function auditClaims(input: AuditInput): AuditResult {
  const now = input.now ?? new Date();
  const ids = new Set<string>();
  const results = input.claims.map((claim): ClaimResult => {
    if (!claim.id.trim() || !claim.statement.trim()) {
      return { claimId: claim.id, status: "BLOCKED", reason: "invalid_claim", evidenceIds: [] };
    }
    const matching = input.evidence.filter((item) => item.claimId === claim.id);
    if (matching.length === 0) {
      return { claimId: claim.id, status: "PENDING", reason: "claim_has_no_evidence", evidenceIds: [] };
    }
    const accepted: string[] = [];
    const rejected: string[] = [];
    for (const item of matching) {
      if (ids.has(item.id)) {
        rejected.push("duplicate_evidence_id");
        continue;
      }
      ids.add(item.id);
      const issue = validEvidence(item, claim, now);
      if (issue) rejected.push(issue);
      else accepted.push(item.id);
    }
    if (accepted.length > 0) {
      return { claimId: claim.id, status: "CONFIRMED", reason: "claim_has_traceable_verified_evidence", evidenceIds: accepted };
    }
    return {
      claimId: claim.id,
      status: matching.some((item) => item.status === "PENDING") ? "PENDING" : "BLOCKED",
      reason: rejected[0] ?? "no_acceptable_evidence",
      evidenceIds: [],
    };
  });
  const summary = {
    total: results.length,
    confirmed: results.filter((r) => r.status === "CONFIRMED").length,
    pending: results.filter((r) => r.status === "PENDING").length,
    blocked: results.filter((r) => r.status === "BLOCKED").length,
  };
  return { decision: summary.pending === 0 && summary.blocked === 0 ? "ALLOW" : "BLOCK", results, summary };
}
