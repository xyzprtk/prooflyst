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
  try {
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

    let existing: Array<{ id: string }> = [];
    try {
      existing = await db
        .select({ id: sites.id })
        .from(sites)
        .where(eq(sites.slug, slug))
        .limit(1);
    } catch {
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
    try {
      await db.insert(sites).values({
        id,
        slug,
        name,
        domain,
        adminKey: adminHash,
        publicKey,
      });
    } catch {
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
  } catch (error) {
    console.error("Setup route failed:", error);
    return apiError(
      "INTERNAL_ERROR",
      "Could not connect to the database. Verify DATABASE_URL and restart the dev server."
    );
  }
}