import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db, isDbAvailable } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getAdminKey } from "@/lib/session";
import { getLocalSiteByAdminHash, updateLocalTestimonialStatus } from "@/lib/local-store";
import { apiError } from "@/lib/errors";

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
  const canUseDb = await isDbAvailable();
  let siteId: string | undefined;

  if (canUseDb) {
    const [siteResult] = await Promise.allSettled([
      db.select({ id: sites.id, slug: sites.slug }).from(sites).where(eq(sites.adminKey, adminHash)).limit(1)
    ]);

    if (siteResult.status === "fulfilled" && siteResult.value.length > 0) {
      siteId = siteResult.value[0].id;
    }
  }

  if (!siteId) {
    const local = await getLocalSiteByAdminHash(adminHash);
    if (local) {
      siteId = local.id;
    }
  }

  if (!siteId) {
    return apiError("UNAUTHORIZED", "Site not found");
  }

  let newStatus: "approved" | "deleted" | "pending";
  if (action === "approve") {
    newStatus = "approved";
  } else if (action === "delete") {
    newStatus = "deleted";
  } else {
    newStatus = "pending"; // restore
  }

  if (canUseDb) {
    const [updateResult] = await Promise.allSettled([
      db
        .update(testimonials)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(and(eq(testimonials.id, id), eq(testimonials.siteId, siteId)))
    ]);

    if (updateResult.status === "fulfilled") {
      return NextResponse.json({ success: true, testimonial: { id, status: newStatus } });
    }
  }

  await updateLocalTestimonialStatus(siteId, id, newStatus);
  return NextResponse.json({ success: true, testimonial: { id, status: newStatus } });
}