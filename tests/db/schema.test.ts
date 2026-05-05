import { describe, it, expect, beforeEach } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db";
import { sites, testimonials } from "../../lib/db/schema";
import { resetTables, seedSite } from "../helpers/db";
import { hashKey } from "../../lib/keys";

describe("db / schema", () => {
  beforeEach(async () => {
    await resetTables();
  });

  describe("sites table", () => {
    it("should insert and retrieve a site", async () => {
      const { site } = await seedSite({ slug: "my-site" });

      const rows = await db.select().from(sites).where(eq(sites.slug, "my-site"));
      expect(rows.length).toBe(1);
      expect(rows[0].name).toBe("Test Site");
      expect(rows[0].slug).toBe("my-site");
    });

    it("should enforce unique slug constraint", async () => {
      await seedSite({ slug: "unique-slug" });

      await expect(
        db.insert(sites).values({
          id: "site_duplicate",
          slug: "unique-slug",
          name: "Another",
          domain: "https://other.com",
          adminKey: "hash",
          publicKey: "key",
          createdAt: new Date(),
        })
      ).rejects.toThrow();
    });

    it("should store and retrieve JSON branding", async () => {
      const branding = { heading: "Hello", accentColor: "#ff5733", wallLayout: "grid" };
      await db.insert(sites).values({
        id: "site_brand",
        slug: "brand-site",
        name: "Branded",
        domain: "https://brand.com",
        adminKey: "hash",
        publicKey: "key",
        branding,
        createdAt: new Date(),
      });

      const rows = await db.select().from(sites).where(eq(sites.id, "site_brand"));
      expect(rows[0].branding).toEqual(branding);
    });

    it("should store createdAt as a Date object", async () => {
      const before = Math.floor(Date.now() / 1000);
      await seedSite({ slug: "date-site" });
      const after = Math.floor(Date.now() / 1000);

      const rows = await db.select().from(sites).where(eq(sites.slug, "date-site"));
      expect(rows[0].createdAt).toBeInstanceOf(Date);
      const storedUnix = Math.floor(rows[0].createdAt.getTime() / 1000);
      expect(storedUnix).toBeGreaterThanOrEqual(before);
      expect(storedUnix).toBeLessThanOrEqual(after);
    });
  });

  describe("testimonials table", () => {
    it("should insert a testimonial linked to a site", async () => {
      const { site } = await seedSite();

      await db.insert(testimonials).values({
        id: "t_001",
        siteId: site.id,
        author: "Alice",
        content: "Amazing!",
        rating: 5,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const rows = await db.select().from(testimonials).where(eq(testimonials.id, "t_001"));
      expect(rows.length).toBe(1);
      expect(rows[0].author).toBe("Alice");
      expect(rows[0].status).toBe("approved");
    });

    it("should default status to pending", async () => {
      const { site } = await seedSite();

      await db.insert(testimonials).values({
        id: "t_002",
        siteId: site.id,
        author: "Bob",
        content: "Good stuff",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const rows = await db.select().from(testimonials).where(eq(testimonials.id, "t_002"));
      expect(rows[0].status).toBe("pending");
    });

    it("should cascade delete testimonials when site is deleted", async () => {
      const { site } = await seedSite();

      await db.insert(testimonials).values({
        id: "t_003",
        siteId: site.id,
        author: "Charlie",
        content: "Nice!",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.delete(sites).where(eq(sites.id, site.id));

      const rows = await db.select().from(testimonials).where(eq(testimonials.siteId, site.id));
      expect(rows.length).toBe(0);
    });

    it("should support indexing by siteId and status", async () => {
      const { site } = await seedSite();

      for (let i = 0; i < 5; i++) {
        await db.insert(testimonials).values({
          id: `t_${i}`,
          siteId: site.id,
          author: `User ${i}`,
          content: "Review",
          status: i % 2 === 0 ? "approved" : "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      const approved = await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.status, "approved"));
      expect(approved.length).toBe(3);
    });
  });

  describe("security", () => {
    it("should safely store SQL injection attempts as plain text", async () => {
      const { site } = await seedSite();
      const maliciousContent = "'; DROP TABLE sites; --";

      await db.insert(testimonials).values({
        id: "t_sql",
        siteId: site.id,
        author: "Hacker",
        content: maliciousContent,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const rows = await db.select().from(testimonials).where(eq(testimonials.id, "t_sql"));
      expect(rows[0].content).toBe(maliciousContent);

      // Verify table still exists
      const sitesCount = await db.select().from(sites);
      expect(sitesCount.length).toBeGreaterThan(0);
    });
  });
});
