// ================================================================
// Auth tokens.
//
// This implements the same idea as a JWT (a signed, tamper-proof,
// expiring token holding the user's id/role) using Node's built-in
// crypto.createHmac, so the project runs with zero extra installs.
//
// Want the real `jsonwebtoken` package instead? `npm install
// jsonwebtoken`, then swap signToken/verifyToken for jwt.sign /
// jwt.verify. Every route only calls these two functions, so nothing
// else needs to change.
// ================================================================

import { createHmac, timingSafeEqual } from "crypto";
import { config } from "../config/env";

const SECRET = config.jwtSecret;
const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface TokenPayload {
  userId: number;
  role: string;
  exp: number; // expiry, ms since epoch
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function signToken(userId: number, role: string): string {
  const payload: TokenPayload = { userId, role, exp: Date.now() + TOKEN_LIFETIME_MS };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}
