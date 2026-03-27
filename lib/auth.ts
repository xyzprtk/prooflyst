import { eq } from "drizzle-orm";
import { db, isDbAvailable } from "./db";
import { sites, type Site } from "./db/schema";
import { hashKey } from "./keys";
import { getLocalSiteByAdminHash } from "./local-store";

export type AuthResult =
  | { success: true; site: Site }
  | { success: false; error: string; status: number };

function localSiteToSite(localSite: {
  id: string;
  slug: string;
  name: string;
  domain: string;
  adminKey: string;
  publicKey: string;
  createdAt: string;
}): Site {
  return {
    id: localSite.id,
    slug: localSite.slug,
    name: localSite.name,
    domain: localSite.domain,
    adminKey: localSite.adminKey,
    publicKey: localSite.publicKey,
    webhookUrl: null,
    branding: null,
    createdAt: new Date(localSite.createdAt),
  };
}

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
  const canUseDb = await isDbAvailable();

  if (canUseDb) {
    const [dbResult] = await Promise.allSettled([
      db
        .select()
        .from(sites)
        .where(eq(sites.adminKey, hashedKey))
        .limit(1)
    ]);

    if (dbResult.status === "fulfilled" && dbResult.value.length > 0) {
      return { success: true, site: dbResult.value[0] };
    }
  }

  // Fall back to local store
  const localSite = await getLocalSiteByAdminHash(hashedKey);
  if (localSite) {
    return { success: true, site: localSiteToSite(localSite) };
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

  const canUseDb = await isDbAvailable();

  if (canUseDb) {
    const [dbResult] = await Promise.allSettled([
      db
        .select()
        .from(sites)
        .where(eq(sites.id, siteId))
        .limit(1)
    ]);

    if (dbResult.status === "fulfilled" && dbResult.value.length > 0) {
      const site = dbResult.value[0];
      if (site.publicKey !== publicKey) {
        return {
          success: false,
          error: "Public key does not match site",
          status: 403,
        };
      }
      return { success: true, site };
    }
  }

  // Fall back to local store
  const { getLocalSiteById } = await import("./local-store");
  const localSite = await getLocalSiteById(siteId);
  
  if (!localSite) {
    return { success: false, error: "Site not found", status: 404 };
  }

  if (localSite.publicKey !== publicKey) {
    return {
      success: false,
      error: "Public key does not match site",
      status: 403,
    };
  }

  return { success: true, site: localSiteToSite(localSite) };
}