import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { publicListSchema } from "@/lib/validations";
import { apiError } from "@/lib/errors";
import { eq, and, desc, asc, lt, gt } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const searchParams = request.nextUrl.searchParams;

  const parsed = publicListSchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    cursor: searchParams.get("cursor") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid query parameters", {
      issues: parsed.error.issues,
    });
  }

  const { limit, cursor, sort } = parsed.data;

  const conditions = [
    eq(testimonials.siteId, siteId),
    eq(testimonials.status, "approved"),
  ];

  if (cursor) {
    const decoded = Buffer.from(cursor, "base64url").toString();
    const orderOp = sort === "oldest" ? gt : lt;
    conditions.push(orderOp(testimonials.createdAt, new Date(decoded)));
  }

  const orderBy =
    sort === "oldest"
      ? asc(testimonials.createdAt)
      : desc(testimonials.createdAt);

  const rows = await db
    .select({
      id: testimonials.id,
      author: testimonials.author,
      content: testimonials.content,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore
    ? Buffer.from(items[items.length - 1].createdAt.toISOString()).toString(
        "base64url"
      )
    : null;

  return NextResponse.json(
    {
      testimonials: items.map((t) => ({
        id: t.id,
        author: t.author,
        content: t.content,
        rating: t.rating,
        created_at: t.createdAt,
      })),
      next_cursor: nextCursor,
      has_more: hasMore,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}