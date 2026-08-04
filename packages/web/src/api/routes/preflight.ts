import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

function computeVerdict(input: {
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  spamScore: number;
  trackingOk: boolean;
}) {
  const authOk = input.spf && input.dkim && input.dmarc;
  const spamOk = input.spamScore < 5;
  if (authOk && spamOk && input.trackingOk) return "aprovado";
  if (!authOk || !spamOk) return "reprovado";
  return "atencao";
}

// Roboavaliador Pre-Flight — deliverability audit
export const preflight = {
  list: base.handler(() =>
    db
      .select()
      .from(schema.preflightChecks)
      .orderBy(desc(schema.preflightChecks.createdAt))
      .limit(100),
  ),

  run: base
    .input(
      z.object({
        domain: z.string().min(3).max(200),
        spf: z.boolean(),
        dkim: z.boolean(),
        dmarc: z.boolean(),
        spamScore: z.number().min(0).max(10),
        trackingOk: z.boolean(),
      }),
    )
    .handler(async ({ input }) => {
      const verdict = computeVerdict(input);
      const [row] = await db
        .insert(schema.preflightChecks)
        .values({ ...input, verdict })
        .returning();
      await db.insert(schema.auditLogs).values({
        action: "preflight_run",
        entity: "preflight",
        entityId: String(row.id),
        actor: "roboavaliador",
        details: `${row.domain} → ${verdict}`,
        complianceFlag: verdict === "reprovado" ? "alert" : "ok",
      });
      return row;
    }),

  remove: base
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      await db
        .delete(schema.preflightChecks)
        .where(eq(schema.preflightChecks.id, input.id));
      return { ok: true };
    }),
};
