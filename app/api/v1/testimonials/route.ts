import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { authenticateAdmin, authenticatePublicKey } from "@/lib/auth";
import {
  submitTestimonialSchema,
  listTestimonialsSchema,
} from "@/lib/validations";
import { apiError } from "@/lib/errors";
import { generateTestimonialId } from "@/lib/keys";
import { sanitizeString } from "@/lib/sanitize";
import { withRetry } from "@/lib/retry";
import { eq, and, desc, asc, lt, gt } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return apiError("VALIDATION_ERROR", "Invalid JSON body");
  }

  const parsed = submitTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid input", {
      issues: parsed.error.issues,
    });
  }

  const { site_id, public_key, author, content, rating } = parsed.data;

  const sanitizedAuthor = sanitizeString(author);
  const sanitizedContent = sanitizeString(content);

  const auth = await authenticatePublicKey(site_id, public_key);
  if (!auth.success) {
    return apiError(
      auth.status === 404 ? "NOT_FOUND" : "FORBIDDEN",
      auth.error
    );
  }

  const id = generateTestimonialId();

  await withRetry(async () => {
    await db.insert(testimonials).values({
      id,
      siteId: site_id,
      author: sanitizedAuthor,
      content: sanitizedContent,
      rating,
      status: "pending",
    });
  });

  return NextResponse.json(
    { success: true, message: "Testimonial submitted successfully." },
    { status: 201 }
  );
}

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request);
  if (!auth.success) {
    return apiError("UNAUTHORIZED", auth.error);
  }

  const searchParams = request.nextUrl.searchParams;
  const parsed = listTestimonialsSchema.safeParse({
    site_id: searchParams.get("site_id"),
    status: searchParams.get("status") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid query parameters", {
      issues: parsed.error.issues,
    });
  }

  const { site_id, status, limit, cursor, sort } = parsed.data;

  if (auth.site.id !== site_id) {
    return apiError("FORBIDDEN", "Admin key does not match site");
  }

  const conditions = [eq(testimonials.siteId, site_id)];
  if (status !== "all") {
    conditions.push(eq(testimonials.status, status));
  }

  if (cursor) {
    const decoded = Buffer.from(cursor, "base64url").toString();
    const orderOp = sort === "oldest" ? gt : lt;
    conditions.push(orderOp(testimonials.createdAt, new Date(decoded)));
  }

  const orderBy =
    sort === "oldest"
      ? asc(testimonials.createdAt)
      : sort === "rating"
        ? desc(testimonials.rating)
        : desc(testimonials.createdAt);

  const rows = await withRetry(async () => {
    return db
      .select()
      .from(testimonials)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit + 1);
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore
    ? Buffer.from(items[items.length - 1].createdAt.toISOString()).toString(
        "base64url"
      )
    : null;

  return NextResponse.json({
    testimonials: items.map((t) => ({
      id: t.id,
      site_id: t.siteId,
      author: t.author,
      content: t.content,
      rating: t.rating,
      status: t.status,
      created_at: t.createdAt,
    })),
    next_cursor: nextCursor,
    has_more: hasMore,
  });
}