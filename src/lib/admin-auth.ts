import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "otama_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const DEFAULT_ADMIN_EMAIL = "admin@otamaweb.local";
const DEFAULT_ADMIN_PASSWORD = "otama123456";
const DEFAULT_SESSION_SECRET = "otamaweb-local-demo-secret-change-in-production";

export function getAdminConfig() {
  const email = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SESSION_SECRET;
  const usingDefaultCredentials =
    !process.env.ADMIN_EMAIL && !process.env.ADMIN_PASSWORD;

  return { email, password, secret, usingDefaultCredentials };
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const cfg = getAdminConfig();
  return (
    safeEqual(email.trim().toLowerCase(), cfg.email) &&
    safeEqual(password, cfg.password)
  );
}

function signPayload(payloadB64: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");
}

export function createSessionToken(email: string): string {
  const cfg = getAdminConfig();
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = JSON.stringify({ email, exp });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = signPayload(payloadB64, cfg.secret);
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(
  token: string | undefined | null
): { email: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;

  const cfg = getAdminConfig();
  const expectedSig = signPayload(payloadB64, cfg.secret);
  if (!safeEqual(sig, expectedSig)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { email?: string; exp?: number };
    if (!parsed.email || typeof parsed.exp !== "number") return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return { email: parsed.email };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production" && Boolean(process.env.VERCEL),
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
