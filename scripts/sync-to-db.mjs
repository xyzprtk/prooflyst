#!/usr/bin/env node

/**
 * Sync local store data to Neon PostgreSQL database
 * 
 * Usage: pnpm sync
 */

import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  const envPath = existsSync(".env.local")
    ? ".env.local"
    : existsSync(".env")
      ? ".env"
      : null;
  if (!envPath) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// Retry helper with exponential backoff
async function retry(operation, label, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`   ⚠️  ${label} attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

const LOCAL_STORE_PATH = join(process.cwd(), ".data", "local-store.json");

async function main() {
  console.log("🔄 Starting sync from local store to database...\n");

  // Warm up the database connection (Neon databases can be cold)
  console.log("🔥 Warming up database connection...");
  try {
    await sql`SELECT 1`;
    console.log("✅ Database connection ready\n");
  } catch {
    console.log("⚠️  Database warm-up failed, proceeding anyway...\n");
  }

  if (!existsSync(LOCAL_STORE_PATH)) {
    console.log("📁 No local store file found. Nothing to sync.");
    return;
  }

  const raw = await readFile(LOCAL_STORE_PATH, "utf8");
  const localData = JSON.parse(raw);

  console.log("📁 Found local store with:");
  console.log(`   - ${localData.sites?.length || 0} sites`);
  console.log(`   - ${localData.testimonials?.length || 0} testimonials\n`);

  let sitesSynced = 0;
  let sitesSkipped = 0;

  if (localData.sites?.length > 0) {
    console.log("🏢 Syncing sites...");
    
    for (const site of localData.sites) {
      try {
        const result = await retry(async () => {
          // Check if site already exists by ID or slug
          const existing = await sql`
            SELECT id, slug FROM sites WHERE id = ${site.id} OR slug = ${site.slug}
          `;

          if (existing.length > 0) {
            sitesSkipped++;
            const reason = existing[0].id === site.id ? 'id exists' : 'slug exists';
            console.log(`   ⏭️  Site ${site.slug} (${site.id}) skipped (${reason})`);
            return { skipped: true };
          }

          // Insert site
          await sql`
            INSERT INTO sites (id, slug, name, domain, admin_key, public_key, created_at)
            VALUES (${site.id}, ${site.slug}, ${site.name}, ${site.domain}, ${site.adminKey}, ${site.publicKey}, ${new Date(site.createdAt)})
          `;
          return { synced: true };
        }, `Site ${site.slug}`);

        if (result?.synced) sitesSynced++;
      } catch (error) {
        console.error(`   ❌ Error syncing site ${site.slug}:`, error.message || error);
        sitesSkipped++;
      }
    }
  }

  let testimonialsSynced = 0;
  let testimonialsSkipped = 0;

  if (localData.testimonials?.length > 0) {
    console.log("\n💬 Syncing testimonials...");
    
    for (const testimonial of localData.testimonials) {
      try {
        const result = await retry(async () => {
          // Check if testimonial already exists
          const existing = await sql`
            SELECT id FROM testimonials WHERE id = ${testimonial.id}
          `;

          if (existing.length > 0) {
            testimonialsSkipped++;
            console.log(`   ⏭️  Testimonial ${testimonial.id} already exists, skipping`);
            return { skipped: true };
          }

          // Check if the site exists
          const siteExists = await sql`
            SELECT id FROM sites WHERE id = ${testimonial.siteId}
          `;

          if (siteExists.length === 0) {
            testimonialsSkipped++;
            console.log(`   ⚠️  Testimonial ${testimonial.id} references missing site, skipping`);
            return { skipped: true };
          }

          // Insert testimonial
          await sql`
            INSERT INTO testimonials (id, site_id, author, content, rating, status, created_at, updated_at)
            VALUES (${testimonial.id}, ${testimonial.siteId}, ${testimonial.author}, ${testimonial.content}, ${testimonial.rating}, ${testimonial.status}, ${new Date(testimonial.createdAt)}, ${new Date(testimonial.updatedAt)})
          `;
          return { synced: true };
        }, `Testimonial ${testimonial.id}`);

        if (result?.synced) testimonialsSynced++;
      } catch (error) {
        console.error(`   ❌ Error syncing testimonial ${testimonial.id}:`, error.message || error);
        testimonialsSkipped++;
      }
    }
  }

  console.log("\n📊 Sync complete!");
  console.log(`   Sites: ${sitesSynced} synced, ${sitesSkipped} skipped`);
  console.log(`   Testimonials: ${testimonialsSynced} synced, ${testimonialsSkipped} skipped`);

  if (sitesSynced > 0 || testimonialsSynced > 0) {
    console.log("\n💡 Tip: You can now safely delete .data/local-store.json if the database is working correctly.");
  }
}

main().catch((error) => {
  console.error("❌ Sync failed:", error);
  process.exit(1);
});