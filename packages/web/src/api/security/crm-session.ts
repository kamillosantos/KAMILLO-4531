import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SESSION_SECONDS = 12 * 60 * 60;

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createCrmSession(secret: string) {
  const payload = Buffer.from(
    JSON.stringify({ sub: "kjs-admin", exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }),
  ).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function verifyCrmSession(token: string | undefined, secret: string) {
  if (!token) return false;
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied) return false;
  const expected = signature(payload, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.sub === "kjs-admin" && Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function passwordsMatch(candidate: string, expected: string) {
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function hasCrmSession(headers: Headers) {
  const secret = process.env.KJS_CRM_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const cookie = headers.get("cookie") ?? "";
  const token = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("kjs_crm_session="))?.slice("kjs_crm_session=".length);
  return verifyCrmSession(token, secret);
}
