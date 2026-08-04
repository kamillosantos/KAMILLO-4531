import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

const STAGES = ["T-04", "T-03", "T-02", "T-01"] as const;

async function log(
  action: string,
  entityId: string | number,
  details: string,
) {
  await db.insert(schema.auditLogs).values({
    action,
    entity: "lead",
    entityId: String(entityId),
    actor: "kamillo-ia",
    details,
  });
}

// B2B Demand Engine — Belgos AI Kanban CRM
export const crm = {
  list: base.handler(() =>
    db.select().from(schema.leads).orderBy(desc(schema.leads.updatedAt)),
  ),

  create: base
    .input(
      z.object({
        name: z.string().min(2).max(120),
        contact: z.string().min(3).max(160),
        company: z.string().max(160).optional(),
        service: z.string().max(120).optional(),
        stage: z.enum(STAGES).optional(),
        score: z.number().int().min(0).max(100).optional(),
        ltvPredicted: z.number().min(0).optional(),
        owner: z.string().max(120).optional(),
        notes: z.string().max(2000).optional(),
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
          stage: input.stage ?? "T-04",
          score: input.score ?? 0,
          ltvPredicted: input.ltvPredicted ?? 0,
          owner: input.owner,
          notes: input.notes,
          source: "painel",
          updatedAt: new Date(),
        })
        .returning();
      await log("create", lead.id, `Lead criado no estágio ${lead.stage}`);
      return lead;
    }),

  moveStage: base
    .input(z.object({ id: z.number(), stage: z.enum(STAGES) }))
    .handler(async ({ input }) => {
      const [lead] = await db
        .update(schema.leads)
        .set({ stage: input.stage, updatedAt: new Date() })
        .where(eq(schema.leads.id, input.id))
        .returning();
      await log("move_stage", input.id, `Movido para ${input.stage}`);
      return lead;
    }),

  update: base
    .input(
      z.object({
        id: z.number(),
        score: z.number().int().min(0).max(100).optional(),
        ltvPredicted: z.number().min(0).optional(),
        owner: z.string().max(120).optional(),
        notes: z.string().max(2000).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const { id, ...rest } = input;
      const [lead] = await db
        .update(schema.leads)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(schema.leads.id, id))
        .returning();
      await log("update", id, "Lead atualizado");
      return lead;
    }),

  remove: base
    .input(z.object({ id: z.number() }))
    .handler(async ({ input }) => {
      await db.delete(schema.leads).where(eq(schema.leads.id, input.id));
      await log("delete", input.id, "Lead removido");
      return { ok: true };
    }),
};
