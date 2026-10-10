// ================================================================
// Password hashing.
//
// We use Node's built-in crypto.scrypt instead of the bcrypt/bcryptjs
// package so the project runs with zero extra installs. It gives the
// same guarantees bcrypt does (slow, salted, one-way hash) - it's just
// not the exact bcrypt algorithm.
//
// Want real bcrypt instead? `npm install bcryptjs`, then swap the two
// functions below for bcrypt.hash / bcrypt.compare. Nothing else in
// the app needs to change - callers only use hashPassword/verifyPassword.
// ================================================================

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(plainTextPassword: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(plainTextPassword, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(plainTextPassword: string, storedHash: string): boolean {
  const [salt, originalKey] = storedHash.split(":");
  if (!salt || !originalKey) return false;

  const derivedKey = scryptSync(plainTextPassword, salt, KEY_LENGTH);
  const originalKeyBuffer = Buffer.from(originalKey, "hex");

  if (originalKeyBuffer.length !== derivedKey.length) return false;
  return timingSafeEqual(derivedKey, originalKeyBuffer);
}
