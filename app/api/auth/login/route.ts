import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getLocalSiteByAdminHash } from "@/lib/local-store";
import { setAdminKey } from "@/lib/session";
import { apiError } from "@/lib/errors";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.key || !body.key.startsWith("pl_admin_")) {
      return apiError("VALIDATION_ERROR", "Invalid admin key format");
    }

    const hashed = hashKey(body.key);
    let site: { id: string } | undefined;
    try {
      [site] = await db
        .select({ id: sites.id })
        .from(sites)
        .where(eq(sites.adminKey, hashed))
        .limit(1);
    } catch {
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
  } catch (error) {
    console.error("Login route failed:", error);
    return apiError("INTERNAL_ERROR", "Could not reach the database. Please try again.");
  }
}