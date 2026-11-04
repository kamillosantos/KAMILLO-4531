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
      consentState: z.literal("granted"),
      consentPurpose: z.array(z.string().min(1).max(64)).min(1).max(12),
      attribution: attributionSchema.optional(),
      schemaVersion: z.literal("1.0.0"),
    }).strict())
    .handler(async ({ input }) => {
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
