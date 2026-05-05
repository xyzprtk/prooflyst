import { db } from "../../lib/db";
import { sites, testimonials } from "../../lib/db/schema";
import {
  generateSiteId,
  generateAdminKey,
  generatePublicKey,
  generateTestimonialId,
  hashKey,
} from "../../lib/keys";

export async function resetTables() {
  await db.delete(testimonials);
  await db.delete(sites);
}

export async function seedSite(overrides?: Partial<{
  id: string;
  slug: string;
  name: string;
  domain: string;
  adminKey: string;
  publicKey: string;
}>) {
  const rawAdminKey = generateAdminKey();
  const site = {
    id: generateSiteId(),
    slug: "test-site",
    name: "Test Site",
    domain: "https://example.com",
    adminKey: hashKey(rawAdminKey),
    publicKey: generatePublicKey(),
    ...overrides,
  };

  await db.insert(sites).values(site);
  return { site, rawAdminKey };
}

export async function seedTestimonial(overrides?: Partial<{
  id: string;
  siteId: string;
  author: string;
  content: string;
  rating: number | null;
  status: "pending" | "approved" | "deleted";
}>) {
  const testimonial = {
    id: generateTestimonialId(),
    siteId: "test-site-id",
    author: "Test Author",
    content: "Great product!",
    rating: 5 as number | null,
    status: "pending" as "pending" | "approved" | "deleted",
    ...overrides,
  };

  await db.insert(testimonials).values({
    ...testimonial,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return testimonial;
}
