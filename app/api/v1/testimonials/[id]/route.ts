import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { authenticateAdmin } from "@/lib/auth";
import { moderateTestimonialSchema } from "@/lib/validations";
import { apiError } from "@/lib/errors";
import { updateLocalTestimonialStatus, getLocalTestimonialById } from "@/lib/local-store";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return apiError("VALIDATION_ERROR", "Invalid JSON body");
  }

  const parsed = moderateTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input", {
      issues: parsed.error.issues,
    });
  }

  const { id } = await params;

  // Try database - use allSettled to never throw
  const [dbResult] = await Promise.allSettled([
    db
      .update(testimonials)
      .set({
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(testimonials.id, id),
          eq(testimonials.siteId, auth.site.id)
        )
      )
      .returning()
  ]);

  if (dbResult.status === "fulfilled" && dbResult.value.length > 0) {
    const updated = dbResult.value[0];
    return NextResponse.json({
      testimonial: {
        id: updated.id,
        status: updated.status,
        updated_at: updated.updatedAt,
      },
    });
  }

  // Database unavailable or not found, fallback to local-store
  const local = await getLocalTestimonialById(auth.site.id, id);
  if (!local) {
    return apiError("NOT_FOUND", "Testimonial not found");
  }

  await updateLocalTestimonialStatus(auth.site.id, id, parsed.data.status);

  return NextResponse.json({
    testimonial: {
      id,
      status: parsed.data.status,
      updated_at: new Date().toISOString(),
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }

  const { id } = await params;

  // Try database - use allSettled to never throw
  const [dbResult] = await Promise.allSettled([
    db
      .update(testimonials)
      .set({
        status: "deleted",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(testimonials.id, id),
          eq(testimonials.siteId, auth.site.id)
        )
      )
      .returning()
  ]);

  if (dbResult.status === "fulfilled" && dbResult.value.length > 0) {
    const deleted = dbResult.value[0];
    return NextResponse.json({
      testimonial: {
        id: deleted.id,
        status: deleted.status,
        updated_at: deleted.updatedAt,
      },
    });
  }

  // Database unavailable or not found, fallback to local-store
  const local = await getLocalTestimonialById(auth.site.id, id);
  if (!local) {
    return apiError("NOT_FOUND", "Testimonial not found");
  }

  await updateLocalTestimonialStatus(auth.site.id, id, "deleted");

  return NextResponse.json({
    testimonial: {
      id,
      status: "deleted",
      updated_at: new Date().toISOString(),
    },
  });
}