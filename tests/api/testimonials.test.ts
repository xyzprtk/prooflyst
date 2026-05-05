import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST as testimonialPost, GET as testimonialGet } from "../../app/api/v1/testimonials/route";
import { GET as publicGet } from "../../app/api/v1/public/testimonials/[siteId]/route";
import { resetTables, seedSite } from "../helpers/db";
import { testCookies } from "../helpers/cookies";
import { createNextRequest } from "../helpers/request";

vi.mock("next/headers", () => ({
  cookies: async () => testCookies,
}));

describe("api / testimonials", () => {
  beforeEach(async () => {
    await resetTables();
    testCookies.clear();
  });

  describe("POST /api/v1/testimonials", () => {
    it("should submit a testimonial with valid public key", async () => {
      const { site } = await seedSite({ slug: "submit-site" });

      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: site.publicKey,
          author: "Alice",
          content: "Great product!",
          rating: 5,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should reject wrong public key", async () => {
      const { site } = await seedSite({ slug: "submit-site" });

      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: "pl_pub_WRONGKEY",
          author: "Alice",
          content: "Great product!",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(403);
    });

    it("should reject missing required fields", async () => {
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({ author: "Alice" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/testimonials (admin)", () => {
    it("should list testimonials for authenticated admin", async () => {
      const { site, rawAdminKey } = await seedSite({ slug: "admin-site" });
      const { seedTestimonial } = await import("../helpers/db");
      await seedTestimonial({ siteId: site.id, status: "pending" });
      await seedTestimonial({ siteId: site.id, status: "approved" });

      const request = createNextRequest(
        `http://localhost/api/v1/testimonials?site_id=${site.id}&status=all`,
        { headers: { Authorization: `Bearer ${rawAdminKey}` } }
      );

      const response = await testimonialGet(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.testimonials.length).toBe(2);
    });

    it("should filter by status", async () => {
      const { site, rawAdminKey } = await seedSite({ slug: "filter-site" });
      const { seedTestimonial } = await import("../helpers/db");
      await seedTestimonial({ siteId: site.id, status: "pending" });
      await seedTestimonial({ siteId: site.id, status: "approved" });

      const request = createNextRequest(
        `http://localhost/api/v1/testimonials?site_id=${site.id}&status=approved`,
        { headers: { Authorization: `Bearer ${rawAdminKey}` } }
      );

      const response = await testimonialGet(request as any);
      const data = await response.json();
      expect(data.testimonials.length).toBe(1);
      expect(data.testimonials[0].status).toBe("approved");
    });

    it("should reject unauthenticated requests", async () => {
      const { site } = await seedSite();
      const request = createNextRequest(
        `http://localhost/api/v1/testimonials?site_id=${site.id}`
      );

      const response = await testimonialGet(request as any);
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/public/testimonials/:siteId", () => {
    it("should list only approved testimonials publicly", async () => {
      const { site } = await seedSite({ slug: "public-site" });
      const { seedTestimonial } = await import("../helpers/db");
      await seedTestimonial({ siteId: site.id, status: "approved", content: "Public review" });
      await seedTestimonial({ siteId: site.id, status: "pending", content: "Hidden review" });

      const request = createNextRequest(
        `http://localhost/api/v1/public/testimonials/${site.id}`
      );

      const response = await publicGet(request as any, { params: Promise.resolve({ siteId: site.id }) });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.testimonials.length).toBe(1);
      expect(data.testimonials[0].content).toBe("Public review");
    });
  });
});
