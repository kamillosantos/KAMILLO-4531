import { describe, expect, test } from "bun:test";
import { gatewayIdempotencyKey, getGatewayTransactionId, verifyGatewaySignature } from "../security/gateway-webhook";

const secret = "test-secret-with-more-than-thirty-two-characters";
async function sign(body: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
  return "sha256=" + Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

describe("gateway webhook evidence and idempotency", () => {
  test("accepts only a valid SHA-256 HMAC of the exact raw body", async () => {
    const raw = JSON.stringify({ transaction_id: "tx-2026-001", status: "approved" });
    expect(await verifyGatewaySignature(raw, await sign(raw), secret)).toBe(true);
    expect(await verifyGatewaySignature(raw + " ", await sign(raw), secret)).toBe(false);
    expect(await verifyGatewaySignature(raw, "sha256=" + "0".repeat(64), secret)).toBe(false);
  });

  test("rejects missing, malformed and oversized transaction identifiers", () => {
    expect(getGatewayTransactionId("tx_001")).toBe("tx_001");
    expect(getGatewayTransactionId("  tx-001  ")).toBe("tx-001");
    expect(getGatewayTransactionId(undefined)).toBeNull();
    expect(getGatewayTransactionId("")).toBeNull();
    expect(getGatewayTransactionId("bad id")).toBeNull();
    expect(getGatewayTransactionId("x".repeat(201))).toBeNull();
  });

  test("derives gateway-scoped idempotency keys from the real transaction id", () => {
    expect(gatewayIdempotencyKey("hotmart", "tx-001")).toBe("hotmart:tx-001");
    expect(gatewayIdempotencyKey("inter", "tx-001")).toBe("inter:tx-001");
    expect(gatewayIdempotencyKey("hotmart", "tx-001")).not.toBe(gatewayIdempotencyKey("inter", "tx-001"));
  });
});
