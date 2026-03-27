import { NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";
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

  const canUseDb = await isDbAvailable();

  // Check for existing slug
  let existing = false;
  
  if (canUseDb) {
    const [existingResult] = await Promise.allSettled([
      db
        .select({ id: sites.id })
        .from(sites)
        .where(eq(sites.slug, slug))
        .limit(1)
    ]);

    if (existingResult.status === "fulfilled" && existingResult.value.length > 0) {
      existing = true;
    }
  }
  
  if (!existing) {
    const local = await getLocalSiteBySlug(slug);
    if (local) {
      existing = true;
    }
  }

  if (existing) {
    return apiError("VALIDATION_ERROR", `Slug "${slug}" is already taken`);
  }

  const id = generateSiteId();
  const publicKey = generatePublicKey();
  const rawAdminKey = generateAdminKey();
  const createdAt = new Date().toISOString();
  const adminHash = hashKey(rawAdminKey);
  
  // Try to insert into database
  let inserted = false;
  
  if (canUseDb) {
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
    inserted = insertResult.status === "fulfilled";
  }

  if (!inserted) {
    // Use local store
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