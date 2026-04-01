import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import {
  generateSiteId,
  generatePublicKey,
  generateAdminKey,
  hashKey,
} from "@/lib/keys";
import { apiError } from "@/lib/errors";
import { withRetry } from "@/lib/retry";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.slug || !body?.domain) {
    return apiError("VALIDATION_ERROR", "Name, slug, and domain are required");
  }

  const { name, slug, domain } = body;

  if (!/^[a-z0-9-]+$/.test(slug) || slug.length < 3) {
    return apiError(
      "VALIDATION_ERROR",
      "Slug must be at least 3 chars, lowercase letters, numbers, and hyphens only"
    );
  }

  // Check for existing slug
  const existing = await withRetry(async () => {
    const [result] = await db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.slug, slug))
      .limit(1);
    return result;
  });

  if (existing) {
    return apiError("VALIDATION_ERROR", `Slug "${slug}" is already taken`);
  }

  const id = generateSiteId();
  const publicKey = generatePublicKey();
  const rawAdminKey = generateAdminKey();
  const adminHash = hashKey(rawAdminKey);

  await withRetry(async () => {
    await db.insert(sites).values({
      id,
      slug,
      name,
      domain,
      adminKey: adminHash,
      publicKey,
    });
  });

  return NextResponse.json(
    {
      site: {
        id,
        name,
        slug,
        admin_key: rawAdminKey,
        public_key: publicKey,
      },
    },
    { status: 201 }
  );
}