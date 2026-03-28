import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sites, testimonials } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { notFound } from "next/navigation";

async function getSiteBySlug(slug: string) {
  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.slug, slug))
    .limit(1);
  return site;
}

async function getApprovedTestimonials(siteId: string) {
  const results = await db
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
    .limit(50);
  return results;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) return { title: "Not Found" };

  return {
    title: `What people say about ${site.name}`,
    description: `Read testimonials from ${site.name} customers`,
    openGraph: {
      title: `What people say about ${site.name}`,
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

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            What people say about {site.name}
          </h1>
          <p className="text-muted-foreground">
            {approved.length} testimonial{approved.length !== 1 ? "s" : ""}
          </p>
        </div>

        {approved.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No testimonials yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {approved.map((t) => (
              <div key={t.id} className="rounded-lg border bg-card p-6">
                <p className="text-card-foreground">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium">{t.author}</span>
                  {t.rating && (
                    <span className="text-xs text-muted-foreground">
                      {"★".repeat(t.rating)}
                      {"☆".repeat(5 - t.rating)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <footer className="text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a
            href={process.env.NEXT_PUBLIC_APP_URL}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Prooflyst
          </a>
        </footer>
      </div>
    </div>
  );
}