import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

// ── B2B CRM ────────────────────────────────────────────────────────
export function useCrmList() {
  return useQuery(orpc.crm.list.queryOptions());
}
export function useCrmCreate() {
  const qc = useQueryClient();
  return useMutation(
    orpc.crm.create.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.crm.key() }),
    }),
  );
}
export function useCrmMove() {
  const qc = useQueryClient();
  return useMutation(
    orpc.crm.moveStage.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.crm.key() });
        qc.invalidateQueries({ queryKey: orpc.audit.key() });
      },
    }),
  );
}
export function useCrmUpdate() {
  const qc = useQueryClient();
  return useMutation(
    orpc.crm.update.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.crm.key() }),
    }),
  );
}
export function useCrmRemove() {
  const qc = useQueryClient();
  return useMutation(
    orpc.crm.remove.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.crm.key() }),
    }),
  );
}

// ── B2C Checkouts ──────────────────────────────────────────────────
export function useCheckouts() {
  return useQuery(orpc.checkouts.list.queryOptions());
}
export function useCheckoutStats() {
  return useQuery(orpc.checkouts.stats.queryOptions());
}
export function useCheckoutCreate() {
  const qc = useQueryClient();
  return useMutation(
    orpc.checkouts.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.checkouts.key() });
        qc.invalidateQueries({ queryKey: orpc.audit.key() });
      },
    }),
  );
}

// ── RevOps Campaigns ───────────────────────────────────────────────
export function useCampaigns() {
  return useQuery(orpc.campaigns.list.queryOptions());
}
export function useCampaignStats() {
  return useQuery(orpc.campaigns.stats.queryOptions());
}
export function useCampaignCreate() {
  const qc = useQueryClient();
  return useMutation(
    orpc.campaigns.create.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.campaigns.key() });
        qc.invalidateQueries({ queryKey: orpc.audit.key() });
      },
    }),
  );
}
export function useCampaignRemove() {
  const qc = useQueryClient();
  return useMutation(
    orpc.campaigns.remove.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.campaigns.key() }),
    }),
  );
}

// ── Roboavaliador Pre-Flight ───────────────────────────────────────
export function usePreflightList() {
  return useQuery(orpc.preflight.list.queryOptions());
}
export function usePreflightRun() {
  const qc = useQueryClient();
  return useMutation(
    orpc.preflight.run.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.preflight.key() });
        qc.invalidateQueries({ queryKey: orpc.audit.key() });
      },
    }),
  );
}

// ── RevOps Audit ───────────────────────────────────────────────────
export function useAuditLogs() {
  return useQuery(orpc.audit.list.queryOptions({ input: {} }));
}
export function useAuditStats() {
  return useQuery(orpc.audit.stats.queryOptions());
}

// ── Kamillo Dev Engine ─────────────────────────────────────────────
export function useDevEngineList() {
  return useQuery(orpc.devEngine.list.queryOptions());
}
export function useDevEngineRun() {
  const qc = useQueryClient();
  return useMutation(
    orpc.devEngine.run.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.devEngine.key() });
        qc.invalidateQueries({ queryKey: orpc.audit.key() });
      },
    }),
  );
}
