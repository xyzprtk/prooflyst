import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getLocalSiteByAdminHash } from "@/lib/local-store";
import { setAdminKey } from "@/lib/session";
import { apiError } from "@/lib/errors";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.key || !body.key.startsWith("pl_admin_")) {
    return apiError("VALIDATION_ERROR", "Invalid admin key format");
  }

  const hashed = hashKey(body.key);
  
  // Try database first - use allSettled to never throw
  const [dbResult] = await Promise.allSettled([
    db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.adminKey, hashed))
      .limit(1)
  ]);

  let site: { id: string } | undefined;
  
  if (dbResult.status === "fulfilled" && dbResult.value.length > 0) {
    site = dbResult.value[0];
  } else {
    // Fall back to local store
    const local = await getLocalSiteByAdminHash(hashed);
    if (local) {
      site = { id: local.id };
    }
  }

  if (!site) {
    return apiError("UNAUTHORIZED", "Admin key not found");
  }

  await setAdminKey(body.key);

  return NextResponse.json({ success: true });
}