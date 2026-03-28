import { NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { setAdminKey } from "@/lib/session";
import { apiError } from "@/lib/errors";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.key || !body.key.startsWith("pl_admin_")) {
    return apiError("VALIDATION_ERROR", "Invalid admin key format");
  }

  const hashed = hashKey(body.key);
  await isDbAvailable();

  const [site] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(eq(sites.adminKey, hashed))
    .limit(1);

  if (!site) {
    return apiError("UNAUTHORIZED", "Admin key not found");
  }

  await setAdminKey(body.key);

  return NextResponse.json({ success: true });
}