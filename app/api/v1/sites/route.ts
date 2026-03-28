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
import { withRetry } from "@/lib/retry";
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

  const [site] = await withRetry(async () => {
    return db
      .insert(sites)
      .values({
        id,
        slug: parsed.data.slug,
        name: parsed.data.name,
        domain: parsed.data.domain,
        adminKey: adminHash,
        publicKey,
        webhookUrl: parsed.data.webhookUrl,
        branding: parsed.data.branding,
      })
      .returning();
  });

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

export async function GET(request: Request) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }

  const adminKey = request.headers.get("authorization")!.slice(7);
  const adminHash = hashKey(adminKey);

  const siteList = await withRetry(async () => {
    return db
      .select({
        id: sites.id,
        slug: sites.slug,
        name: sites.name,
        domain: sites.domain,
        publicKey: sites.publicKey,
        createdAt: sites.createdAt,
      })
      .from(sites)
      .where(eq(sites.adminKey, adminHash));
  });

  return NextResponse.json({
    sites: siteList.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      domain: s.domain,
      public_key: s.publicKey,
      created_at: s.createdAt,
    })),
  });
}