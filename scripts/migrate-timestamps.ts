#!/usr/bin/env node

/**
 * Migrate timestamps from seconds to milliseconds.
 *
 * The seed scripts originally stored Unix timestamps in seconds,
 * but Drizzle's `integer({ mode: "timestamp" })` expects milliseconds.
 * This script finds all timestamps that are in seconds (values < 10 billion)
 * and multiplies them by 1000.
 *
 * Usage:
 *   npx tsx scripts/migrate-timestamps.ts
 */

import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";

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

const SECONDS_THRESHOLD = 10_000_000_000;

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("❌ TURSO_DATABASE_URL is not set");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  // Count testimonials that need migration
  const testimonialCount = await client.execute({
    sql: `SELECT COUNT(*) as c FROM testimonials WHERE created_at < ?`,
    args: [SECONDS_THRESHOLD],
  });
  const testimonialNeedsMigration = Number(testimonialCount.rows[0].c);

  // Count sites that need migration
  const siteCount = await client.execute({
    sql: `SELECT COUNT(*) as c FROM sites WHERE created_at < ?`,
    args: [SECONDS_THRESHOLD],
  });
  const siteNeedsMigration = Number(siteCount.rows[0].c);

  console.log(`📊 Testimonials needing migration: ${testimonialNeedsMigration}`);
  console.log(`📊 Sites needing migration: ${siteNeedsMigration}`);

  if (testimonialNeedsMigration === 0 && siteNeedsMigration === 0) {
    console.log("✅ All timestamps are already in milliseconds. Nothing to do.");
    return;
  }

  // Migrate testimonials
  if (testimonialNeedsMigration > 0) {
    const result = await client.execute({
      sql: `
        UPDATE testimonials
        SET created_at = created_at * 1000,
            updated_at = updated_at * 1000
        WHERE created_at < ?
      `,
      args: [SECONDS_THRESHOLD],
    });
    console.log(`✅ Migrated ${result.rowsAffected} testimonials`);
  }

  // Migrate sites
  if (siteNeedsMigration > 0) {
    const result = await client.execute({
      sql: `
        UPDATE sites
        SET created_at = created_at * 1000
        WHERE created_at < ?
      `,
      args: [SECONDS_THRESHOLD],
    });
    console.log(`✅ Migrated ${result.rowsAffected} sites`);
  }

  // Verify a sample
  const sample = await client.execute({
    sql: `SELECT author, created_at FROM testimonials ORDER BY created_at DESC LIMIT 1`,
  });
  if (sample.rows.length > 0) {
    const ts = Number(sample.rows[0].created_at);
    console.log(`\n🔍 Sample: ${sample.rows[0].author}`);
    console.log(`   Stored value: ${ts}`);
    console.log(`   As Date: ${new Date(ts).toISOString()}`);
  }

  console.log("\n✅ Migration complete");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
