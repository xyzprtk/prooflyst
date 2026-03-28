import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/hosted/testimonial-form";

async function getSiteBySlug(slug: string) {
  const [site] = await db
    .select()
    .from(sites)
    .where(eq(sites.slug, slug))
    .limit(1);
  return site;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) return { title: "Not Found" };

  const heading = site.branding?.heading ?? "Share your experience";

  return {
    title: `${heading} — ${site.name}`,
    description: `Leave a testimonial for ${site.name}`,
  };
}

export default async function HostedFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) notFound();

  const heading = site.branding?.heading ?? "Share your experience";
  const accentColor = site.branding?.accentColor ?? "#6366f1";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground">
            We&apos;d love to hear what you think about {site.name}.
          </p>
        </div>

        <TestimonialForm
          siteId={site.id}
          publicKey={site.publicKey}
          siteName={site.name}
          accentColor={accentColor}
          thankYouMessage={site.branding?.thankYou ?? "Thanks for your testimonial!"}
        />

        <footer className="text-center text-xs text-muted-foreground">
          Collect testimonials for your product →{" "}
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