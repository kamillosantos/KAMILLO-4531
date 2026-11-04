import { eq } from "drizzle-orm";
import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

const attributionSchema = z.object({
  utm_source: z.string().max(256).optional(),
  utm_medium: z.string().max(256).optional(),
  utm_campaign: z.string().max(256).optional(),
  utm_content: z.string().max(256).optional(),
  utm_term: z.string().max(256).optional(),
  referrer_host: z.string().max(256).optional(),
}).strict();

export const analytics = {
  recordConsent: base
    .input(z.object({
      state: z.enum(["granted", "denied", "withdrawn"]),
      purposes: z.array(z.string().min(1).max(64)).max(12),
      noticeVersion: z.string().min(1).max(32),
      receiptId: z.string().min(16).max(128).optional(),
    }).strict())
    .handler(async ({ input }) => {
      if (input.state === "withdrawn") {
        if (!input.receiptId) return { ok: false, reason: "receipt_required" as const };
        const [receipt] = await db
          .select()
          .from(schema.consentReceipts)
          .where(eq(schema.consentReceipts.receiptId, input.receiptId))
          .limit(1);
        if (!receipt) return { ok: false, reason: "receipt_not_found" as const };
        await db.update(schema.consentReceipts)
          .set({ state: "withdrawn", withdrawnAt: new Date() })
          .where(eq(schema.consentReceipts.receiptId, input.receiptId));
        return { ok: true, state: "withdrawn" as const };
      }

      const receiptId = crypto.randomUUID();
      await db.insert(schema.consentReceipts).values({
        receiptId,
        state: input.state,
        purposes: JSON.stringify(input.purposes),
        noticeVersion: input.noticeVersion,
      });
      return { ok: true, receiptId, state: input.state };
    }),

  ingest: base
    .input(z.object({
      eventId: z.string().min(8).max(128),
      eventName: z.string().regex(/^[a-z][a-z0-9_]{1,63}$/),
      occurredAt: z.string().datetime({ offset: true }),
      environment: z.enum(["development", "staging", "production"]),
      source: z.enum(["web", "mobile", "server", "import"]),
      anonymousId: z.string().max(128).optional(),
      offerId: z.string().max(128).optional(),
      assetId: z.string().max(128).optional(),
      consentReceiptId: z.string().min(16).max(128),
      consentPurpose: z.array(z.string().min(1).max(64)).min(1).max(12),
      attribution: attributionSchema.optional(),
      schemaVersion: z.literal("1.0.0"),
    }).strict())
    .handler(async ({ input }) => {
      const [receipt] = await db
        .select()
        .from(schema.consentReceipts)
        .where(eq(schema.consentReceipts.receiptId, input.consentReceiptId))
        .limit(1);

      if (!receipt || receipt.state !== "granted" || receipt.withdrawnAt) {
        return { accepted: false, reason: "valid_consent_required" as const };
      }

      const grantedPurposes = JSON.parse(receipt.purposes) as string[];
      if (!input.consentPurpose.every((purpose) => grantedPurposes.includes(purpose))) {
        return { accepted: false, reason: "purpose_not_authorized" as const };
      }

      const [inserted] = await db
        .insert(schema.analyticsEvents)
        .values({
          eventId: input.eventId,
          eventName: input.eventName,
          occurredAt: new Date(input.occurredAt),
          environment: input.environment,
          source: input.source,
          anonymousId: input.anonymousId,
          offerId: input.offerId,
          assetId: input.assetId,
          consentPurpose: JSON.stringify(input.consentPurpose),
          attribution: JSON.stringify(input.attribution ?? {}),
          schemaVersion: input.schemaVersion,
        })
        .onConflictDoNothing()
        .returning({ id: schema.analyticsEvents.id });

      return inserted
        ? { accepted: true, duplicate: false, id: inserted.id }
        : { accepted: true, duplicate: true };
    }),
};
