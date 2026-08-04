import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

// RevOps — Neural bidding governance (campaign ledger)
export const campaigns = {
  list: base.handler(() =>
    db
      .select()
      .from(schema.campaigns)
      .orderBy(desc(schema.campaigns.updatedAt)),
  ),

  stats: base.handler(async () => {
    const rows = await db.select().from(schema.campaigns);
    const spend = rows.reduce((s, r) => s + r.spend, 0);
    const revenue = rows.reduce((s, r) => s + r.revenue, 0);
    const active = rows.filter((r) => r.status === "active").length;
    return {
      count: rows.length,
      active,
      spend,
      revenue,
      roas: spend > 0 ? revenue / spend : 0,
    };
  }),

  create: base
    .input(
      z.object({
        name: z.string().min(1).max(160),
        channel: z.string().max(60).optional(),
        objective: z.string().max(120).optional(),
        spend: z.number().min(0).optional(),
        revenue: z.number().min(0).optional(),
        roasTarget: z.number().min(0).optional(),
        status: z.string().max(40).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const [row] = await db
        .insert(schema.campaigns)
        .values({
          name: input.name,
          channel: input.channel ?? "Meta Ads",
          objective: input.objective,
          spend: input.spend ?? 0,
          revenue: input.revenue ?? 0,
          roasTarget: input.roasTarget ?? 3,
          status: input.status ?? "active",
          updatedAt: new Date(),
        })
        .returning();
      await db.insert(schema.auditLogs).values({
        action: "campaign_create",
        entity: "campaign",
        entityId: String(row.id),
        actor: "painel",
        details: `${row.channel} · ${row.name}`,
      });
      return row;
    }),

  update: base
    .input(
      z.object({
        id: z.number(),
        spend: z.number().min(0).optional(),
        revenue: z.number().min(0).optional(),
        roasTarget: z.number().min(0).optional(),
        status: z.string().max(40).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const { id, ...rest } = input;
      const [row] = await db
        .update(schema.campaigns)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(schema.campaigns.id, id))
        .returning();
      return row;
    }),

  remove: base
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      await db.delete(schema.campaigns).where(eq(schema.campaigns.id, input.id));
      return { ok: true };
    }),
};
