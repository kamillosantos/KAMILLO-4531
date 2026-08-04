import { z } from "zod";
import { desc } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

const ARCH = ["MICROSERVICES", "MONOLITH_EVOLVED", "SERVERLESS"] as const;
const SECURITY = ["ENTERPRISE_HIGH", "STANDARD"] as const;

// Kamillo Dev Engine — executeBraDataSoftwareEngine equivalent.
// Validates enterprise architecture spec and persists each run + audit log.
export const devEngine = {
  list: base.handler(() =>
    db
      .select()
      .from(schema.devEngineRuns)
      .orderBy(desc(schema.devEngineRuns.createdAt))
      .limit(100),
  ),

  run: base
    .input(
      z.object({
        projectName: z.string().min(2).max(160),
        architectureType: z.enum(ARCH),
        securityLevel: z.enum(SECURITY),
        customFeatures: z.array(z.string().max(120)).max(30).default([]),
        apiFirstReady: z.boolean().default(true),
      }),
    )
    .handler(async ({ input }) => {
      const securityAudit =
        input.securityLevel === "ENTERPRISE_HIGH"
          ? "HMAC_JWT_ENCRYPTED"
          : "STANDARD";

      const [row] = await db
        .insert(schema.devEngineRuns)
        .values({
          projectName: input.projectName,
          architectureType: input.architectureType,
          securityLevel: input.securityLevel,
          customFeatures: JSON.stringify(input.customFeatures),
          apiFirstReady: input.apiFirstReady,
          securityAudit,
          signature: "BRADATA_SOFTWARE_HOUSE_VERIFIED",
          status: "SYSTEM_ARCHITECTED",
        })
        .returning();

      await db.insert(schema.auditLogs).values({
        action: "dev_engine_run",
        entity: "dev_engine",
        entityId: String(row.id),
        actor: "kamillo-dev-engine",
        details: `${input.projectName} · ${input.architectureType} · ${securityAudit}`,
        complianceFlag:
          input.securityLevel === "ENTERPRISE_HIGH" ? "ok" : "review",
      });

      return {
        status: "SYSTEM_ARCHITECTED",
        signature: "BRADATA_SOFTWARE_HOUSE_VERIFIED",
        run: row,
      };
    }),
};
