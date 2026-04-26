import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { withRetry } from "@/lib/retry";
import { WallHeader } from "@/components/hosted/wall-header";
import { WallFooter } from "@/components/hosted/wall-footer";
import { MasonryGrid } from "@/components/hosted/masonry-grid";
import { TestimonialCard } from "@/components/hosted/testimonial-card";

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
      .limit(12);
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

  const approved = await getApprovedTestimonials(site.id);

  const columns = site.branding?.wallColumns ?? 3;
  const cardStyle = site.branding?.wallCardStyle ?? "default";
  const accentColor = site.branding?.accentColor ?? "#6366f1";
  const showRating = site.branding?.wallShowRating ?? true;
  const showDate = site.branding?.wallShowDate ?? false;
  const showAvatar = site.branding?.wallShowAvatar ?? true;

  return (
    <div
      className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12"
      style={{ "--accent-color": accentColor } as React.CSSProperties}
    >
      <div className="flex flex-col gap-8">
        <WallHeader
          siteName={site.name}
          heading={site.branding?.heading}
          count={approved.length}
          slug={slug}
          accentColor={accentColor}
        />

        {approved.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No testimonials yet.
            </p>
            <a
              href={`/t/${slug}`}
              className="text-sm underline underline-offset-4 transition-colors hover:text-foreground"
              style={{ color: accentColor }}
            >
              Be the first to share your experience
            </a>
          </div>
        ) : (
          <MasonryGrid columns={columns}>
            {approved.map((t) => (
              <TestimonialCard
                key={t.id}
                id={t.id}
                author={t.author}
                content={t.content}
                rating={t.rating}
                createdAt={t.createdAt}
                cardStyle={cardStyle}
                showRating={showRating}
                showDate={showDate}
                showAvatar={showAvatar}
                accentColor={accentColor}
              />
            ))}
          </MasonryGrid>
        )}

        <WallFooter accentColor={accentColor} />
      </div>
    </div>
  );
}