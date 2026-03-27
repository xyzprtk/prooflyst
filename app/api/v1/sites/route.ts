import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { authenticateAdmin } from "@/lib/auth";
import { createSiteSchema } from "@/lib/validations";
import { apiError } from "@/lib/errors";
import {
  generateSiteId,
  generatePublicKey,
  generateAdminKey,
  hashKey,
} from "@/lib/keys";
import {
  getLocalSiteBySlug,
  insertLocalSite,
  listLocalSitesByAdminHash,
} from "@/lib/local-store";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return apiError("VALIDATION_ERROR", "Invalid JSON body");
  }

  const parsed = createSiteSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input", {
      issues: parsed.error.issues,
    });
  }

  const { slug } = parsed.data;

  // Check for existing slug - use allSettled to never throw
  const [existingResult] = await Promise.allSettled([
    db
      .select({ id: sites.id })
      .from(sites)
      .where(eq(sites.slug, slug))
      .limit(1)
  ]);

  if (existingResult.status === "fulfilled" && existingResult.value.length > 0) {
    return apiError("VALIDATION_ERROR", `Slug "${slug}" is already taken`);
  }

  const id = generateSiteId();
  const publicKey = generatePublicKey();
  const rawAdminKey = generateAdminKey();

  // Try database insert - use allSettled to never throw
  const [insertResult] = await Promise.allSettled([
    db
      .insert(sites)
      .values({
        id,
        slug: parsed.data.slug,
        name: parsed.data.name,
        domain: parsed.data.domain,
        adminKey: hashKey(rawAdminKey),
        publicKey,
        webhookUrl: parsed.data.webhookUrl,
        branding: parsed.data.branding,
      })
      .returning()
  ]);

  if (insertResult.status === "fulfilled" && insertResult.value.length > 0) {
    const site = insertResult.value[0];
    return NextResponse.json(
      {
        site: {
          id: site.id,
          slug: site.slug,
          name: site.name,
          domain: site.domain,
          public_key: site.publicKey,
          admin_key: rawAdminKey,
          hosted_form_url: `${process.env.NEXT_PUBLIC_APP_URL}/t/${site.slug}`,
          hosted_wall_url: `${process.env.NEXT_PUBLIC_APP_URL}/wall/${site.slug}`,
          created_at: site.createdAt,
        },
      },
      { status: 201 }
    );
  }

  // Check local store for existing slug
  const existing = await getLocalSiteBySlug(slug);
  if (existing) {
    return apiError("VALIDATION_ERROR", `Slug "${slug}" is already taken`);
  }

  // Fallback to local store
  const createdAt = new Date().toISOString();
  await insertLocalSite({
    id,
    slug: parsed.data.slug,
    name: parsed.data.name,
    domain: parsed.data.domain,
    adminKey: hashKey(rawAdminKey),
    publicKey,
    createdAt,
  });

  return NextResponse.json(
    {
      site: {
        id,
        slug: parsed.data.slug,
        name: parsed.data.name,
        domain: parsed.data.domain,
        public_key: publicKey,
        admin_key: rawAdminKey,
        hosted_form_url: `${process.env.NEXT_PUBLIC_APP_URL}/t/${parsed.data.slug}`,
        hosted_wall_url: `${process.env.NEXT_PUBLIC_APP_URL}/wall/${parsed.data.slug}`,
        created_at: createdAt,
      },
    },
    { status: 201 }
  );
}

export async function GET(request: Request) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }

  // Try database - use allSettled to never throw
  const [dbResult] = await Promise.allSettled([
    db
      .select({
        id: sites.id,
        slug: sites.slug,
        name: sites.name,
        domain: sites.domain,
        publicKey: sites.publicKey,
        createdAt: sites.createdAt,
      })
      .from(sites)
      .where(eq(sites.adminKey, hashKey(request.headers.get("authorization")!.slice(7))))
  ]);

  if (dbResult.status === "fulfilled") {
    return NextResponse.json({
      sites: dbResult.value.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        domain: s.domain,
        public_key: s.publicKey,
        created_at: s.createdAt,
      })),
    });
  }

  // Database unavailable, fallback to local-store
  const localSites = await listLocalSitesByAdminHash(auth.site.adminKey);
  return NextResponse.json({
    sites: localSites.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      public_key: s.publicKey,
      created_at: s.createdAt,
    })),
  });
}