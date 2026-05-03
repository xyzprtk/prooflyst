import type { Metadata } from "next";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { withRetry } from "@/lib/retry";
import { TestimonialForm } from "@/components/hosted/testimonial-form";
import { FormHeader } from "@/components/hosted/form-header";
import { WallFooter } from "@/components/hosted/wall-footer";

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
  const accentColor = site.branding?.accentColor;

  return (
    <div className="min-h-screen flex flex-col">
      <FormHeader
        siteName={site.name}
        heading={heading}
        slug={slug}
        accentColor={accentColor}
      />

      <div className="flex-1 mx-auto w-full max-w-lg px-6 py-8">
        <TestimonialForm
          siteId={site.id}
          publicKey={site.publicKey}
          siteName={site.name}
          accentColor={accentColor}
          thankYouMessage={site.branding?.thankYou ?? "Thanks for your testimonial!"}
        />
      </div>

      <WallFooter />
    </div>
  );
}