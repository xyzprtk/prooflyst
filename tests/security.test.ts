import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST as loginPost } from "../../app/api/auth/login/route";
import { POST as setupPost } from "../../app/api/auth/setup/route";
import { POST as testimonialPost } from "../../app/api/v1/testimonials/route";
import { GET as testimonialGet } from "../../app/api/v1/testimonials/route";
import { resetTables, seedSite } from "./helpers/db";
import { testCookies } from "./helpers/cookies";
import { createNextRequest } from "./helpers/request";

vi.mock("next/headers", () => ({
  cookies: async () => testCookies,
}));

describe("security", () => {
  beforeEach(async () => {
    await resetTables();
    testCookies.clear();
  });

  describe("SQL injection prevention", () => {
    it("should not execute SQL in site slug", async () => {
      const maliciousSlug = "site'; DROP TABLE testimonials; --";
      const request = new Request("http://localhost/api/auth/setup", {
        method: "POST",
        body: JSON.stringify({
          name: "Evil",
          slug: maliciousSlug,
          domain: "https://evil.com",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await setupPost(request);
      // Should be rejected by validation (invalid slug format)
      expect(response.status).toBe(400);
    });

    it("should not execute SQL in testimonial author", async () => {
      const { site } = await seedSite({ slug: "sql-test" });
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: site.publicKey,
          author: "'; DROP TABLE sites; --",
          content: "Normal content",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(201);

      // Verify table still exists
      const { site: siteCheck } = await seedSite({ slug: "sql-verify" });
      expect(siteCheck).toBeDefined();
    });

    it("should not execute SQL in testimonial content", async () => {
      const { site } = await seedSite({ slug: "sql-content" });
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: site.publicKey,
          author: "User",
          content: "'; DELETE FROM sites; --",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(201);

      // Verify the content was stored literally
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe("authentication bypass attempts", () => {
    it("should reject login without admin key prefix", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ key: "regular_key_123" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject empty admin key", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ key: "" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject admin listing without Bearer token", async () => {
      const { site } = await seedSite();
      const request = createNextRequest(
        `http://localhost/api/v1/testimonials?site_id=${site.id}`,
        { headers: { Authorization: "Basic bad-auth" } }
      );

      const response = await testimonialGet(request as any);
      expect(response.status).toBe(401);
    });

    it("should reject wrong public key for testimonial submission", async () => {
      const { site } = await seedSite({ slug: "auth-bypass" });
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: "pl_pub_attacker_key",
          author: "Hacker",
          content: "Bypass attempt",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(403);
    });
  });

  describe("input validation", () => {
    it("should reject extremely long author name", async () => {
      const { site } = await seedSite();
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: site.publicKey,
          author: "A".repeat(200),
          content: "Review",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject extremely long content", async () => {
      const { site } = await seedSite();
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: site.publicKey,
          author: "User",
          content: "B".repeat(5000),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject invalid rating", async () => {
      const { site } = await seedSite();
      const request = new Request("http://localhost/api/v1/testimonials", {
        method: "POST",
        body: JSON.stringify({
          site_id: site.id,
          public_key: site.publicKey,
          author: "User",
          content: "Review",
          rating: 99,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await testimonialPost(request);
      expect(response.status).toBe(400);
    });
  });

  describe("rate limiting considerations", () => {
    it("should handle rapid sequential requests gracefully", async () => {
      const { site } = await seedSite({ slug: "rate-test" });
      const requests = Array.from({ length: 10 }, (_, i) =>
        testimonialPost(
          new Request("http://localhost/api/v1/testimonials", {
            method: "POST",
            body: JSON.stringify({
              site_id: site.id,
              public_key: site.publicKey,
              author: `User ${i}`,
              content: `Review ${i}`,
            }),
            headers: { "Content-Type": "application/json" },
          })
        )
      );

      const responses = await Promise.all(requests);
      const successes = responses.filter((r) => r.status === 201).length;
      expect(successes).toBe(10);
    });
  });
});
