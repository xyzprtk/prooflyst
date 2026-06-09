import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { authenticateAdmin } from "@/lib/auth";
import { moderateTestimonialSchema } from "@/lib/validations";
import { apiError } from "@/lib/errors";
import { hashKey } from "@/lib/keys";
import { withRetry } from "@/lib/retry";
import { checkRateLimit, adminLimiter } from "@/lib/rate-limit";
import { eq, and } from "drizzle-orm";

async function checkAdminRateLimit(request: Request) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return { auth, limited: false, headers: {} };
  }
  const adminKey = request.headers.get("authorization")!.slice(7);
  const adminHash = hashKey(adminKey);
  const { limited, headers } = await checkRateLimit(adminLimiter, `admin:${adminHash}`);
  return { auth, limited, headers };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { auth, limited, headers } = await checkAdminRateLimit(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }
  if (limited) {
    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", undefined, headers);
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

  const [updated] = await withRetry(async () => {
    return db
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
      .returning();
  });

  if (!updated) {
    return apiError("NOT_FOUND", "Testimonial not found", undefined, headers);
  }

  return NextResponse.json(
    {
      testimonial: {
        id: updated.id,
        status: updated.status,
        updated_at: updated.updatedAt,
      },
    },
    { headers }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { auth, limited, headers } = await checkAdminRateLimit(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }
  if (limited) {
    return apiError("RATE_LIMITED", "Too many requests. Please try again later.", undefined, headers);
  }

  const { id } = await params;

  const [deleted] = await withRetry(async () => {
    return db
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
      .returning();
  });

  if (!deleted) {
    return apiError("NOT_FOUND", "Testimonial not found", undefined, headers);
  }

  return NextResponse.json(
    {
      testimonial: {
        id: deleted.id,
        status: deleted.status,
        updated_at: deleted.updatedAt,
      },
    },
    { headers }
  );
}