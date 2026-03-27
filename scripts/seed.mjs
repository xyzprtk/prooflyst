import { readFileSync, existsSync } from "node:fs";
import { randomBytes, createHash } from "node:crypto";
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

function randomString(length) {
  return randomBytes(length).toString("base64url").slice(0, length);
}

function hashKey(key) {
  return createHash("sha256").update(key).digest("hex");
}

loadEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to .env.");
}

const sql = neon(process.env.DATABASE_URL);

const siteId = `site_${randomString(16)}`;
const slug = `demo-${randomString(6).toLowerCase()}`;
const publicKey = `pl_pub_${randomString(32)}`;
const adminKey = `pl_admin_${randomString(32)}`;
const adminKeyHash = hashKey(adminKey);

const now = new Date().toISOString();

await sql.query(
  `
  INSERT INTO sites (id, slug, name, domain, admin_key, public_key, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,
  [siteId, slug, "Prooflyst Demo Site", "https://example.com", adminKeyHash, publicKey, now]
);

const testimonials = [
  ["Asha", "Prooflyst made collecting testimonials effortless.", 5, "approved"],
  ["Rahul", "I integrated it in 10 minutes. Super clean API.", 5, "approved"],
  ["Sana", "Love the hosted wall. Looks polished out of the box.", 4, "pending"],
];

for (const [author, content, rating, status] of testimonials) {
  await sql.query(
    `
    INSERT INTO testimonials (id, site_id, author, content, rating, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
    `,
    [`t_${randomString(16)}`, siteId, author, content, rating, status, now]
  );
}

console.log("\nSeed complete.\n");
console.log(`Site ID:      ${siteId}`);
console.log(`Site Slug:    ${slug}`);
console.log(`Public Key:   ${publicKey}`);
console.log(`Admin Key:    ${adminKey}`);
console.log(`Hosted Form:  ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/t/${slug}`);
console.log(`Hosted Wall:  ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/wall/${slug}`);
console.log(`Dashboard:    ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/login`);
