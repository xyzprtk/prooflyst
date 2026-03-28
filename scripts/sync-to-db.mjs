#!/usr/bin/env node

/**
 * Sync local store data to Neon PostgreSQL database
 * 
 * Usage: node scripts/sync-to-db.mjs
 * 
 * This script:
 * 1. Reads data from .data/local-store.json
 * 2. Checks if records already exist in the database
 * 3. Inserts only new records (avoids duplicates)
 * 4. Reports what was synced
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
  console.error("   Set it in .env.local or .env file");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const LOCAL_STORE_PATH = join(process.cwd(), ".data", "local-store.json");

async function main() {
  console.log("🔄 Starting sync from local store to database...\n");

  // Check if local store exists
  if (!existsSync(LOCAL_STORE_PATH)) {
    console.log("📁 No local store file found. Nothing to sync.");
    return;
  }

  // Read local store
  const raw = await readFile(LOCAL_STORE_PATH, "utf8");
  const localData = JSON.parse(raw);

  console.log("📁 Found local store with:");
  console.log(`   - ${localData.sites?.length || 0} sites`);
  console.log(`   - ${localData.testimonials?.length || 0} testimonials\n`);

  // Sync sites
  let sitesSynced = 0;
  let sitesSkipped = 0;

  if (localData.sites?.length > 0) {
    console.log("🏢 Syncing sites...");
    
    for (const site of localData.sites) {
      // Check if site already exists by ID
      const existing = await sql`
        SELECT id FROM sites WHERE id = ${site.id}
      `;

      if (existing.length > 0) {
        sitesSkipped++;
        console.log(`   ⏭️  Site ${site.slug} (${site.id}) already exists, skipping`);
        continue;
      }

      // Insert site
      await sql`
        INSERT INTO sites (id, slug, name, domain, admin_key, public_key, created_at)
        VALUES (
          ${site.id},
          ${site.slug},
          ${site.name},
          ${site.domain},
          ${site.adminKey},
          ${site.publicKey},
          ${new Date(site.createdAt)}
        )
      `;
      sitesSynced++;
      console.log(`   ✅ Synced site: ${site.name} (${site.slug})`);
    }
  }

  // Sync testimonials
  let testimonialsSynced = 0;
  let testimonialsSkipped = 0;

  if (localData.testimonials?.length > 0) {
    console.log("\n💬 Syncing testimonials...");
    
    for (const testimonial of localData.testimonials) {
      // Check if testimonial already exists by ID
      const existing = await sql`
        SELECT id FROM testimonials WHERE id = ${testimonial.id}
      `;

      if (existing.length > 0) {
        testimonialsSkipped++;
        console.log(`   ⏭️  Testimonial ${testimonial.id} already exists, skipping`);
        continue;
      }

      // Insert testimonial
      await sql`
        INSERT INTO testimonials (id, site_id, author, content, rating, status, created_at, updated_at)
        VALUES (
          ${testimonial.id},
          ${testimonial.siteId},
          ${testimonial.author},
          ${testimonial.content},
          ${testimonial.rating},
          ${testimonial.status},
          ${new Date(testimonial.createdAt)},
          ${new Date(testimonial.updatedAt)}
        )
      `;
      testimonialsSynced++;
      console.log(`   ✅ Synced testimonial from ${testimonial.author}`);
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