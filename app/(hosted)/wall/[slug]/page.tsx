import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { withRetry } from "@/lib/retry";
import { TestimonialWall } from "@/components/hosted/testimonial-wall";

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

async function getApprovedTestimonials(siteId: string) {
  return withRetry(async () => {
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
      .limit(13);
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) notFound();

  const rows = await getApprovedTestimonials(site.id);
  const hasMore = rows.length > 12;
  const approved = hasMore ? rows.slice(0, 12) : rows;

  const nextCursor = hasMore
    ? Buffer.from(approved[approved.length - 1].createdAt.toISOString()).toString("base64url")
    : null;

  const initialTestimonials = approved.map((t) => ({
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
      nextCursor={nextCursor}
      initialCount={approved.length}
    />
  );
}