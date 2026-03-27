import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dns from "node:dns";
import * as schema from "./schema";

function normalizeDatabaseUrl(rawUrl?: string): string {
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env.local in the project root."
    );
  }

  // Neon HTTP driver can fail with `channel_binding=require` in some local setups.
  // Remove only this parameter and keep everything else intact.
  const cleaned = rawUrl
    .replace(/([?&])channel_binding=[^&]*/g, "$1")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");

  return cleaned;
}

const sql = neon(normalizeDatabaseUrl(process.env.DATABASE_URL));

// Prefer IPv4 first in local environments to avoid intermittent Neon fetch failures
// on networks where IPv6 is present but partially unreachable.
dns.setDefaultResultOrder("ipv4first");

export const db = drizzle({ client: sql, schema });
