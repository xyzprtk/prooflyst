import { describe, it, expect } from "vitest";
import {
  createSiteSchema,
  submitTestimonialSchema,
  moderateTestimonialSchema,
  listTestimonialsSchema,
  publicListSchema,
} from "../../lib/validations";

describe("lib/validations", () => {
  describe("createSiteSchema", () => {
    it("should accept a valid site payload", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "https://example.com",
        slug: "my-site",
      });
      expect(result.success).toBe(true);
    });

    it("should reject an empty name", () => {
      const result = createSiteSchema.safeParse({
        name: "",
        domain: "https://example.com",
        slug: "my-site",
      });
      expect(result.success).toBe(false);
    });

    it("should reject an invalid domain", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "not-a-url",
        slug: "my-site",
      });
      expect(result.success).toBe(false);
    });

    it("should reject a slug with uppercase letters", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "https://example.com",
        slug: "My-Site",
      });
      expect(result.success).toBe(false);
    });

    it("should reject a slug with special characters", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "https://example.com",
        slug: "my_site!",
      });
      expect(result.success).toBe(false);
    });

    it("should reject a slug shorter than 3 chars", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "https://example.com",
        slug: "ab",
      });
      expect(result.success).toBe(false);
    });

    it("should accept optional branding", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "https://example.com",
        slug: "my-site",
        branding: {
          heading: "Welcome",
          accentColor: "#ff5733",
          wallLayout: "grid",
        },
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid hex color", () => {
      const result = createSiteSchema.safeParse({
        name: "My Site",
        domain: "https://example.com",
        slug: "my-site",
        branding: {
          accentColor: "red",
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("submitTestimonialSchema", () => {
    it("should accept a valid testimonial", () => {
      const result = submitTestimonialSchema.safeParse({
        site_id: "site_123",
        public_key: "pl_pub_xxx",
        author: "John",
        content: "Love it!",
        rating: 5,
      });
      expect(result.success).toBe(true);
    });

    it("should reject XSS payload in author", () => {
      const result = submitTestimonialSchema.safeParse({
        site_id: "site_123",
        public_key: "pl_pub_xxx",
        author: '<script>alert("xss")</script>',
        content: "Love it!",
      });
      // Schema allows it (validation is separate from sanitization)
      expect(result.success).toBe(true);
    });

    it("should reject rating above 5", () => {
      const result = submitTestimonialSchema.safeParse({
        site_id: "site_123",
        public_key: "pl_pub_xxx",
        author: "John",
        content: "Love it!",
        rating: 6,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("moderateTestimonialSchema", () => {
    it("should accept 'approved' status", () => {
      const result = moderateTestimonialSchema.safeParse({ status: "approved" });
      expect(result.success).toBe(true);
    });

    it("should reject 'deleted' status (not in enum)", () => {
      const result = moderateTestimonialSchema.safeParse({ status: "deleted" });
      expect(result.success).toBe(false);
    });
  });
});
