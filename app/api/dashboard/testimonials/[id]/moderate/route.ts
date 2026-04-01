import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getAdminKey } from "@/lib/session";
import { apiError } from "@/lib/errors";
import { withRetry } from "@/lib/retry";
import { getCachedSite, setCachedSite, type CachedSite } from "@/lib/site-cache";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const adminKey = await getAdminKey();
  if (!adminKey) {
    return apiError("UNAUTHORIZED", "Not authenticated");
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action as string;

  if (action !== "approve" && action !== "delete" && action !== "restore") {
    return apiError("VALIDATION_ERROR", "Action must be 'approve', 'delete', or 'restore'");
  }

  const adminHash = hashKey(adminKey);

  // Try cache first
  let site: CachedSite | null = await getCachedSite(adminHash);

  // If not in cache, query database
  if (!site) {
    const [dbSite] = await withRetry(async () => {
      return db
        .select({ id: sites.id, name: sites.name, slug: sites.slug, adminKey: sites.adminKey })
        .from(sites)
        .where(eq(sites.adminKey, adminHash))
        .limit(1);
    });

    if (!dbSite) {
      return apiError("UNAUTHORIZED", "Site not found");
    }

    site = dbSite;
    
    // Cache for future requests
    await setCachedSite(adminHash, site);
  }

  let newStatus: "approved" | "deleted" | "pending";
  if (action === "approve") {
    newStatus = "approved";
  } else if (action === "delete") {
    newStatus = "deleted";
  } else {
    newStatus = "pending";
  }

  const result = await withRetry(async () => {
    return db
      .update(testimonials)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
  });

  if (!result || result.length === 0) {
    return apiError("NOT_FOUND", "Testimonial not found");
  }

  // Security check: ensure testimonial belongs to the site
  if (result[0].siteId !== site.id) {
    return apiError("FORBIDDEN", "Testimonial does not belong to your site");
  }

  return NextResponse.json({ success: true, testimonial: { id, status: newStatus } });
}