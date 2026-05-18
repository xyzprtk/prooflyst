import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { notFound } from "next/navigation";
import { withRetry } from "@/lib/retry";
import { TestimonialWall } from "@/components/hosted/testimonial-wall";

const PAGE_SIZE = 20;

async function getSiteBySlug(slug: string) {
  return withRetry(async () => {
    const [site] = await db
      .select()
      .from(sites)
      .where(eq(sites.slug, slug))
      .limit(1);
    return site;
  });
}

async function getApprovedTestimonialsPage(siteId: string, page: number) {
  return withRetry(async () => {
    const offset = (page - 1) * PAGE_SIZE;
    return db
      .select({
        id: testimonials.id,
        author: testimonials.author,
        content: testimonials.content,
        rating: testimonials.rating,
        createdAt: testimonials.createdAt,
      })
      .from(testimonials)
      .where(
        and(
          eq(testimonials.siteId, siteId),
          eq(testimonials.status, "approved")
        )
      )
      .orderBy(desc(testimonials.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset);
  });
}

async function getApprovedTestimonialsCount(siteId: string) {
  return withRetry(async () => {
    const [result] = await db
      .select({ count: count() })
      .from(testimonials)
      .where(
        and(
          eq(testimonials.siteId, siteId),
          eq(testimonials.status, "approved")
        )
      );
    return Number(result.count);
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) return { title: "Not Found" };

  const heading =
    site.branding?.heading ?? `What people say about ${site.name}`;

  return {
    title: heading,
    description: `Read testimonials from ${site.name} customers`,
    openGraph: {
      title: heading,
      description: `Read testimonials from ${site.name} customers`,
      type: "website",
    },
  };
}

export default async function TestimonialWallPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { slug } = await params;
  const { p } = await searchParams;

  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const currentPage = Math.max(1, parseInt(p ?? "1", 10) || 1);
  const [rows, totalCount] = await Promise.all([
    getApprovedTestimonialsPage(site.id, currentPage),
    getApprovedTestimonialsCount(site.id),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const initialTestimonials = rows.map((t) => ({
    id: t.id,
    author: t.author,
    content: t.content,
    rating: t.rating,
    created_at: t.createdAt.toISOString(),
  }));

  return (
    <TestimonialWall
      siteName={site.name}
      siteId={site.id}
      slug={slug}
      branding={site.branding}
      initialTestimonials={initialTestimonials}
      initialPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}
