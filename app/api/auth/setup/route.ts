import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import {
  generateSiteId,
  generatePublicKey,
  generateAdminKey,
  hashKey,
} from "@/lib/keys";
import { getLocalSiteBySlug, insertLocalSite } from "@/lib/local-store";
import { apiError } from "@/lib/errors";
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

  // Check for existing slug - use allSettled to never throw
  const [existingResult] = await Promise.allSettled([
    db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.slug, slug))
      .limit(1)
  ]);

  let existing: Array<{ id: string }> = [];
  if (existingResult.status === "fulfilled") {
    existing = existingResult.value;
  } else {
    const local = await getLocalSiteBySlug(slug);
    existing = local ? [{ id: local.id }] : [];
  }

  if (existing.length > 0) {
    return apiError("VALIDATION_ERROR", `Slug "${slug}" is already taken`);
  }

  const id = generateSiteId();
  const publicKey = generatePublicKey();
  const rawAdminKey = generateAdminKey();

  const createdAt = new Date().toISOString();
  const adminHash = hashKey(rawAdminKey);
  
  // Try to insert into database - use allSettled to never throw
  const [insertResult] = await Promise.allSettled([
    db.insert(sites).values({
      id,
      slug,
      name,
      domain,
      adminKey: adminHash,
      publicKey,
    })
  ]);

  if (insertResult.status === "rejected") {
    // Database insert failed, use local store
    await insertLocalSite({
      id,
      slug,
      name,
      domain,
      adminKey: adminHash,
      publicKey,
      createdAt,
    });
  }

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