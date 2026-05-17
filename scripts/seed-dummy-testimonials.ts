#!/usr/bin/env node

/**
 * Seed 50 dummy approved testimonials for pagination testing.
 *
 * Usage:
 *   npx tsx scripts/seed-dummy-testimonials.ts
 *
 * This finds the first site in your database and inserts 50 approved
 * testimonials with varied authors, ratings, and realistic content.
 */

import { createClient } from "@libsql/client";
import { randomBytes } from "crypto";
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

function randomString(length: number) {
  return randomBytes(length).toString("base64url").slice(0, length);
}

function generateTestimonialId() {
  return `t_${randomString(16)}`;
}

const AUTHORS = [
  "Sarah Chen", "James Wilson", "Aisha Patel", "Michael Torres",
  "Emma Johnson", "Raj Sharma", "Lisa Anderson", "David Kim",
  "Priya Nair", "Tom Bradley", "Nina Kowalski", "Omar Hassan",
  "Claire Dubois", "Kenji Tanaka", "Maria Garcia", "Alex Petrov",
  "Sophie Martin", "Jamal Carter", "Yuki Tanaka", "Rachel Green",
  "Liam O'Brien", "Fatima Al-Rashid", "Chris Evans", "Anika Bose",
  "Marcus Johnson", "Elena Rodriguez", "Sam Patel", "Zoe Williams",
  "Derek Liu", "Isabelle Moreau", "Ryan Murphy", "Amara Diallo",
  "Kyle Brooks", "Mira Joshi", "Tyler Nguyen", "Sofia Rossi",
  "Jordan Lee", "Nadia Hassan", "Benjamin Clark", "Mei Lin",
  "Connor Walsh", "Aaliyah Johnson", "Dmitri Volkov", "Layla Ahmed",
  "Ethan Cooper", "Zara Khan", "Nathan Scott", "Rosa Martinez",
  "Adrian Chen", "Hana Kimura",
];

const CONTENT_TEMPLATES = [
  "This completely changed how we handle customer feedback. The setup was effortless and the results speak for themselves.",
  "We've tried three other solutions before landing on this. Nothing comes close in terms of speed and reliability.",
  "Integration took literally 10 minutes. Our developers were impressed by the clean API and great documentation.",
  "The hosted wall looks incredibly professional out of the box. Our visitors actually engage with it now.",
  "Finally, a testimonial tool that doesn't look like an afterthought. The design is thoughtful and modern.",
  "Customer support has been outstanding. Had a question about custom domains and got a helpful response within an hour.",
  "We switched from a competitor two months ago and haven't looked back. Better pricing, better performance, better UX.",
  "The moderation workflow is exactly what we needed. Approve, delete, restore — all intuitive and fast.",
  "Our conversion rate on the landing page jumped 18% after adding the testimonial wall. Seriously.",
  "Love that we can customize the accent color and layout to match our brand perfectly.",
  "We collect testimonials from 4 different products and managing them all in one dashboard is a game changer.",
  "The public API is well-designed. We even built a custom widget for our mobile app using it.",
  "I was skeptical about another SaaS tool, but this one actually delivers on its promises. Rare these days.",
  "Dark mode support on the hosted pages is a nice touch. Our users appreciate the attention to detail.",
  "Been using this for 6 months across two projects. Rock solid, zero downtime, and constantly improving.",
  "The copy-paste embed code made it so easy to add to our Next.js site. No complex configuration needed.",
  "Our marketing team loves how easy it is to curate and showcase the best testimonials.",
  "Great for SaaS products that need social proof without the bloat of enterprise review platforms.",
  "The fact that testimonials are verified through our own domain gives them more credibility than generic review sites.",
  "Perfect balance between simplicity and power. Exactly what we were looking for.",
];

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("❌ TURSO_DATABASE_URL is not set");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  // Find the first site
  const siteResult = await client.execute("SELECT id, name, slug FROM sites LIMIT 1");
  if (siteResult.rows.length === 0) {
    console.error("❌ No site found. Run `pnpm seed` or create a site first.");
    process.exit(1);
  }

  const site = siteResult.rows[0];
  console.log(`📍 Found site: ${site.name} (${site.slug})`);

  // Check current testimonial count
  const countResult = await client.execute({
    sql: "SELECT COUNT(*) as count FROM testimonials WHERE site_id = ?",
    args: [site.id],
  });
  const currentCount = Number(countResult.rows[0].count);
  console.log(`📊 Current testimonials: ${currentCount}`);

  // Generate and insert 50 approved testimonials
  const now = Date.now();
  let inserted = 0;

  for (let i = 0; i < 50; i++) {
    const author = AUTHORS[i % AUTHORS.length];
    const content = CONTENT_TEMPLATES[i % CONTENT_TEMPLATES.length];
    const rating = [1, 2, 3, 4, 5, 5, 5, 4, 5, 5][i % 10]; // skewed toward 4-5 stars
    const createdAt = now - i * 3600 * 6; // spaced 6 hours apart

    try {
      await client.execute({
        sql: `
          INSERT INTO testimonials (id, site_id, author, content, rating, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          generateTestimonialId(),
          site.id,
          author,
          content,
          rating,
          "approved",
          createdAt,
          createdAt,
        ],
      });
      inserted++;
    } catch (err) {
      console.error(`❌ Failed to insert testimonial ${i + 1}:`, (err as Error).message);
    }
  }

  console.log(`\n✅ Inserted ${inserted} approved testimonials`);
  console.log(`🔗 View wall: http://localhost:3000/wall/${site.slug}`);
  console.log(`🔗 View dashboard: http://localhost:3000/dashboard`);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
