import { randomBytes } from "crypto";

/** URL-safe random id. 9 bytes -> 12 base64url chars, 12 bytes -> 16 chars. */
export function generateId(byteLength = 9): string {
  return randomBytes(byteLength).toString("base64url");
}
