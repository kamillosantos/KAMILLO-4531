import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export const leads = {
  create: base
    .input(
      z.object({
        name: z.string().min(2).max(120),
        contact: z.string().min(3).max(160),
        company: z.string().max(160).optional(),
        service: z.string().max(120).optional(),
        message: z.string().max(2000).optional(),
        source: z.string().max(60).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const [lead] = await db
        .insert(schema.leads)
        .values({
          name: input.name,
          contact: input.contact,
          company: input.company,
          service: input.service,
          message: input.message,
          source: input.source ?? "site",
        })
        .returning();
      return { ok: true, id: lead.id };
    }),
};
