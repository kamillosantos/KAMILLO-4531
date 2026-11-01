import { z } from "zod";
import { asc, desc, eq } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { hasCrmSession } from "../security/crm-session";

function assertAdmin(headers: Headers) {
  if (!hasCrmSession(headers)) throw new Error("Acesso restrito ao operador autenticado.");
}

function botReply(message: string) {
  const text = message.toLocaleLowerCase("pt-BR");
  if (/preço|valor|quanto custa|investimento/.test(text))
    return "Para indicar o investimento correto, preciso entender seu objetivo e o estágio atual da operação. Qual resultado você busca?";
  if (/tráfego|anúncio|ads|campanha/.test(text))
    return "Podemos avaliar aquisição, mídia e conversão em conjunto. Você já anuncia? Se sim, em quais canais?";
  if (/consultoria|serviço|contratar|reunião/.test(text))
    return "Perfeito. Vou encaminhar seu interesse para atendimento humano da KJS. Se preferir, continue pelo WhatsApp oficial.";
  if (/humano|pessoa|atendente|kamillo/.test(text))
    return "Vou sinalizar atendimento humano. Nossa equipe dará continuidade assim que estiver disponível.";
  return "Obrigado por compartilhar. Para direcionar seu atendimento, conte um pouco sobre sua empresa, seu principal desafio e o resultado que deseja alcançar.";
}

export const inbox = {
  list: base.handler(async ({ context }) => {
    assertAdmin(context.headers);
    return db.select().from(schema.crmConversations).orderBy(desc(schema.crmConversations.updatedAt));
  }),

  messages: base
    .input(z.object({ conversationId: z.number().int().positive() }))
    .handler(async ({ input, context }) => {
      assertAdmin(context.headers);
      return db.select().from(schema.crmMessages)
        .where(eq(schema.crmMessages.conversationId, input.conversationId))
        .orderBy(asc(schema.crmMessages.createdAt));
    }),

  create: base
    .input(z.object({
      contactName: z.string().min(2).max(120),
      contact: z.string().min(3).max(160),
      channel: z.enum(["web", "whatsapp", "instagram", "manual"]).default("manual"),
      consentRecorded: z.literal(true),
    }))
    .handler(async ({ input, context }) => {
      assertAdmin(context.headers);
      const [conversation] = await db.insert(schema.crmConversations)
        .values({ ...input, status: "bot" }).returning();
      await db.insert(schema.crmMessages).values({
        conversationId: conversation.id,
        direction: "outbound",
        senderType: "bot",
        content: "Olá! Sou o assistente inicial da KJS. Como posso ajudar?",
      });
      await db.insert(schema.auditLogs).values({
        action: "conversation_created",
        entity: "crm_conversation",
        entityId: String(conversation.id),
        actor: "kjs-admin",
        details: "Conversa criada no inbox",
      });
      return conversation;
    }),

  receive: base
    .input(z.object({
      conversationId: z.number().int().positive(),
      content: z.string().min(1).max(4000),
    }))
    .handler(async ({ input, context }) => {
      assertAdmin(context.headers);
      const [conversation] = await db.select().from(schema.crmConversations)
        .where(eq(schema.crmConversations.id, input.conversationId)).limit(1);
      if (!conversation) throw new Error("Conversa não encontrada.");
      await db.insert(schema.crmMessages).values({
        conversationId: input.conversationId,
        direction: "inbound",
        senderType: "contact",
        content: input.content,
      });
      const answer = botReply(input.content);
      const [botMessage] = await db.insert(schema.crmMessages).values({
        conversationId: input.conversationId,
        direction: "outbound",
        senderType: "bot",
        content: answer,
      }).returning();
      await db.update(schema.crmConversations)
        .set({ status: "bot", updatedAt: new Date() })
        .where(eq(schema.crmConversations.id, input.conversationId));
      return botMessage;
    }),

  reply: base
    .input(z.object({
      conversationId: z.number().int().positive(),
      content: z.string().min(1).max(4000),
    }))
    .handler(async ({ input, context }) => {
      assertAdmin(context.headers);
      const [message] = await db.insert(schema.crmMessages).values({
        conversationId: input.conversationId,
        direction: "outbound",
        senderType: "human",
        content: input.content,
      }).returning();
      await db.update(schema.crmConversations)
        .set({ status: "human", assignedTo: "KJS", updatedAt: new Date() })
        .where(eq(schema.crmConversations.id, input.conversationId));
      return message;
    }),

  handoff: base
    .input(z.object({ conversationId: z.number().int().positive() }))
    .handler(async ({ input, context }) => {
      assertAdmin(context.headers);
      const [conversation] = await db.update(schema.crmConversations)
        .set({ status: "waiting_human", assignedTo: "KJS", updatedAt: new Date() })
        .where(eq(schema.crmConversations.id, input.conversationId)).returning();
      await db.insert(schema.auditLogs).values({
        action: "conversation_handoff",
        entity: "crm_conversation",
        entityId: String(input.conversationId),
        actor: "kjs-admin",
        details: "Atendimento transferido para humano",
      });
      return conversation;
    }),
};
