import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST as loginPost } from "../../app/api/auth/login/route";
import { POST as setupPost } from "../../app/api/auth/setup/route";
import { resetTables } from "../helpers/db";
import { testCookies } from "../helpers/cookies";

vi.mock("next/headers", () => ({
  cookies: async () => testCookies,
}));

describe("api / auth", () => {
  beforeEach(async () => {
    await resetTables();
    testCookies.clear();
  });

  describe("POST /api/auth/setup", () => {
    it("should create a site with valid input", async () => {
      const request = new Request("http://localhost/api/auth/setup", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo Site",
          slug: "demo-site",
          domain: "https://demo.com",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await setupPost(request);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.site).toBeDefined();
      expect(data.site.slug).toBe("demo-site");
      expect(data.site.admin_key).toMatch(/^pl_admin_/);
      expect(data.site.public_key).toMatch(/^pl_pub_/);
    });

    it("should reject missing fields", async () => {
      const request = new Request("http://localhost/api/auth/setup", {
        method: "POST",
        body: JSON.stringify({ name: "Demo" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await setupPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject invalid slug format", async () => {
      const request = new Request("http://localhost/api/auth/setup", {
        method: "POST",
        body: JSON.stringify({
          name: "Demo",
          slug: "Invalid_Slug!",
          domain: "https://demo.com",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await setupPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject duplicate slugs", async () => {
      const body = {
        name: "Demo Site",
        slug: "duplicate-slug",
        domain: "https://demo.com",
      };

      await setupPost(
        new Request("http://localhost/api/auth/setup", {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })
      );

      const response = await setupPost(
        new Request("http://localhost/api/auth/setup", {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })
      );

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should authenticate with valid admin key", async () => {
      // First create a site
      const setupResponse = await setupPost(
        new Request("http://localhost/api/auth/setup", {
          method: "POST",
          body: JSON.stringify({
            name: "Demo",
            slug: "login-site",
            domain: "https://demo.com",
          }),
          headers: { "Content-Type": "application/json" },
        })
      );
      const { site } = await setupResponse.json();

      // Then login
      const loginResponse = await loginPost(
        new Request("http://localhost/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ key: site.admin_key }),
          headers: { "Content-Type": "application/json" },
        })
      );

      expect(loginResponse.status).toBe(200);
      const data = await loginResponse.json();
      expect(data.success).toBe(true);
    });

    it("should reject invalid admin key", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ key: "pl_admin_fakekey123" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPost(request);
      expect(response.status).toBe(401);
    });

    it("should reject malformed key", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ key: "not-an-admin-key" }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPost(request);
      expect(response.status).toBe(400);
    });

    it("should reject missing key", async () => {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      });

      const response = await loginPost(request);
      expect(response.status).toBe(400);
    });
  });
});
