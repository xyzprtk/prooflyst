import { eq } from "drizzle-orm";
import { db, isDbAvailable } from "./db";
import { sites, type Site } from "./db/schema";
import { hashKey } from "./keys";

export type AuthResult =
  | { success: true; site: Site }
  | { success: false; error: string; status: number };

export async function authenticateAdmin(
  request: Request
): Promise<AuthResult> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      success: false,
      error: "Missing or invalid Authorization header",
      status: 401,
    };
  }

  const key = authHeader.slice(7);
  if (!key.startsWith("pl_admin_")) {
    return {
      success: false,
      error: "Invalid admin key format",
      status: 401,
    };
  }

  const hashedKey = hashKey(key);
  await isDbAvailable();

  const [result] = await db
    .select()
    .from(sites)
    .where(eq(sites.adminKey, hashedKey))
    .limit(1);

  if (result) {
    return { success: true, site: result };
  }

  return { success: false, error: "Invalid admin key", status: 401 };
}

export async function authenticatePublicKey(
  siteId: string,
  publicKey: string
): Promise<AuthResult> {
  if (!publicKey.startsWith("pl_pub_")) {
    return {
      success: false,
      error: "Invalid public key format",
      status: 401,
    };
  }

  await isDbAvailable();

  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.id, siteId))
    .limit(1);

  if (!site) {
    return { success: false, error: "Site not found", status: 404 };
  }

  if (site.publicKey !== publicKey) {
    return {
      success: false,
      error: "Public key does not match site",
      status: 403,
    };
  }

  return { success: true, site };
}