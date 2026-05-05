import { describe, it, expect } from "vitest";
import {
  generatePublicKey,
  generateAdminKey,
  hashKey,
  generateSiteId,
  generateTestimonialId,
} from "../../lib/keys";

describe("lib/keys", () => {
  describe("generatePublicKey", () => {
    it("should generate a key with the pl_pub_ prefix", () => {
      const key = generatePublicKey();
      expect(key).toMatch(/^pl_pub_[A-Za-z0-9_-]+$/);
    });

    it("should generate unique keys each time", () => {
      const key1 = generatePublicKey();
      const key2 = generatePublicKey();
      expect(key1).not.toBe(key2);
    });

    it("should generate keys of expected length", () => {
      const key = generatePublicKey();
      // "pl_pub_" (7) + 32 random chars = 39 chars
      expect(key.length).toBe(39);
    });
  });

  describe("generateAdminKey", () => {
    it("should generate a key with the pl_admin_ prefix", () => {
      const key = generateAdminKey();
      expect(key).toMatch(/^pl_admin_[A-Za-z0-9_-]+$/);
    });

    it("should generate unique keys each time", () => {
      const key1 = generateAdminKey();
      const key2 = generateAdminKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe("hashKey", () => {
    it("should return a SHA-256 hex string", () => {
      const hash = hashKey("test-key");
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should produce deterministic output", () => {
      const hash1 = hashKey("same-input");
      const hash2 = hashKey("same-input");
      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different inputs", () => {
      const hash1 = hashKey("input-a");
      const hash2 = hashKey("input-b");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("generateSiteId", () => {
    it("should generate an ID with the site_ prefix", () => {
      const id = generateSiteId();
      expect(id).toMatch(/^site_[A-Za-z0-9_-]+$/);
    });
  });

  describe("generateTestimonialId", () => {
    it("should generate an ID with the t_ prefix", () => {
      const id = generateTestimonialId();
      expect(id).toMatch(/^t_[A-Za-z0-9_-]+$/);
    });
  });
});
