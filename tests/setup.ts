import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Clean up and create a fresh temp directory for the test DB
const testDbDir = mkdtempSync(path.join(tmpdir(), "prooflyst-test-"));
const testDbPath = path.join(testDbDir, "test.db");

// Set env BEFORE any module imports the db
process.env.TURSO_DATABASE_URL = `file:${testDbPath}`;
process.env.TURSO_AUTH_TOKEN = "test-token";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
(process.env as Record<string, string>).NODE_ENV = "test";

// Import db after setting env
const { client } = await import("../lib/db/index");

// Create tables matching the schema exactly
await client.execute(`
  CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    admin_key TEXT NOT NULL,
    public_key TEXT NOT NULL,
    webhook_url TEXT,
    branding TEXT,
    created_at INTEGER NOT NULL
  )
`);

await client.execute(`
  CREATE TABLE testimonials (
    id TEXT PRIMARY KEY,
    site_id TEXT NOT NULL,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
  )
`);

await client.execute(
  "CREATE INDEX testimonials_site_id_idx ON testimonials(site_id)"
);
await client.execute(
  "CREATE INDEX testimonials_status_idx ON testimonials(status)"
);
await client.execute(
  "CREATE INDEX testimonials_site_status_idx ON testimonials(site_id, status)"
);

console.log(`[test setup] SQLite test DB ready at ${testDbPath}`);

// Cleanup on process exit
process.on("exit", () => {
  try {
    rmSync(testDbDir, { recursive: true, force: true });
  } catch {}
});
