import { z } from "zod";
import { desc } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

// RevOps / Governance / LGPD — audit trail
export const audit = {
  list: base
    .input(z.object({ limit: z.number().min(1).max(500).optional() }).optional())
    .handler(({ input }) =>
      db
        .select()
        .from(schema.auditLogs)
        .orderBy(desc(schema.auditLogs.createdAt))
        .limit(input?.limit ?? 200),
    ),

  stats: base.handler(async () => {
    const rows = await db.select().from(schema.auditLogs);
    const alerts = rows.filter((r) => r.complianceFlag !== "ok").length;
    const byEntity: Record<string, number> = {};
    for (const r of rows) byEntity[r.entity] = (byEntity[r.entity] ?? 0) + 1;
    return { total: rows.length, alerts, byEntity };
  }),
};
