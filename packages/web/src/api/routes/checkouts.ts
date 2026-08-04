import { z } from "zod";
import { desc } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

const GATEWAYS = [
  "Hotmart",
  "Kiwify",
  "ClickBank",
  "BuyGoods",
  "Eduzz",
  "Monetizze",
] as const;

const OFFER_TYPES = [
  "main",
  "tripwire",
  "order_bump",
  "upsell",
  "downsell",
] as const;

// B2C Infoproduct Engine — 101X funnel + gateway webhook ledger
export const checkouts = {
  list: base.handler(() =>
    db
      .select()
      .from(schema.checkouts)
      .orderBy(desc(schema.checkouts.createdAt))
      .limit(200),
  ),

  stats: base.handler(async () => {
    const rows = await db.select().from(schema.checkouts);
    const approved = rows.filter((r) => r.status === "approved");
    const revenue = approved.reduce((s, r) => s + r.amount, 0);
    const byOffer: Record<string, number> = {};
    for (const r of approved) {
      byOffer[r.offerType] = (byOffer[r.offerType] ?? 0) + 1;
    }
    const aov = approved.length ? revenue / approved.length : 0;
    return {
      total: rows.length,
      approved: approved.length,
      revenue,
      aov,
      byOffer,
    };
  }),

  create: base
    .input(
      z.object({
        gateway: z.enum(GATEWAYS),
        product: z.string().min(1).max(200),
        offerType: z.enum(OFFER_TYPES).optional(),
        buyerName: z.string().max(160).optional(),
        buyerEmail: z.string().max(200).optional(),
        amount: z.number().min(0),
        currency: z.string().max(8).optional(),
        status: z.string().max(40).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const [row] = await db
        .insert(schema.checkouts)
        .values({
          gateway: input.gateway,
          product: input.product,
          offerType: input.offerType ?? "main",
          buyerName: input.buyerName,
          buyerEmail: input.buyerEmail,
          amount: input.amount,
          currency: input.currency ?? "BRL",
          status: input.status ?? "approved",
          idempotencyKey: `manual_${Date.now()}`,
        })
        .returning();
      await db.insert(schema.auditLogs).values({
        action: "checkout_create",
        entity: "checkout",
        entityId: String(row.id),
        actor: "painel",
        details: `${row.gateway} · ${row.product} · ${row.offerType}`,
      });
      return row;
    }),
};
