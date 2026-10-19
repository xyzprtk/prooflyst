import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { setAdminKey } from "@/lib/session";
import { apiError } from "@/lib/errors";
import { withRetry } from "@/lib/retry";
import { checkRateLimit, publicSubmitLimiter, getClientIP } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const { limited, headers } = await checkRateLimit(publicSubmitLimiter, `auth:${ip}`);
  if (limited) {
    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", undefined, headers);
  }

  const body = await request.json().catch(() => null);
  if (!body?.key || !body.key.startsWith("pl_admin_")) {
    return apiError("VALIDATION_ERROR", "Invalid admin key format", undefined, headers);
  }

  const hashed = hashKey(body.key);

  const site = await withRetry(async () => {
    const [result] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.adminKey, hashed))
      .limit(1);
    return result;
  });

  if (!site) {
    return apiError("UNAUTHORIZED", "Admin key not found", undefined, headers);
  }

  await setAdminKey(body.key);

  return NextResponse.json({ success: true }, { headers });
}