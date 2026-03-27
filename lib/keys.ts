import { randomBytes, createHash } from "crypto";

const PUBLIC_KEY_PREFIX = "pl_pub_";
const ADMIN_KEY_PREFIX = "pl_admin_";

function generateRandomString(length: number): string {
  return randomBytes(length).toString("base64url").slice(0, length);
}

export function generatePublicKey(): string {
  return `${PUBLIC_KEY_PREFIX}${generateRandomString(32)}`;
}

export function generateAdminKey(): string {
  return `${ADMIN_KEY_PREFIX}${generateRandomString(32)}`;
}

export function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function generateSiteId(): string {
  return `site_${generateRandomString(16)}`;
}

export function generateTestimonialId(): string {
  return `t_${generateRandomString(16)}`;
}
