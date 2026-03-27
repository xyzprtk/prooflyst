import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function normalizeDatabaseUrl(rawUrl?: string): string {
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL is missing. Add it to .env.local in the project root."
    );
  }
  const cleaned = rawUrl
    .replace(/([?&])channel_binding=[^&]*/g, "$1")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
  return cleaned;
}

const sql = neon(normalizeDatabaseUrl(process.env.DATABASE_URL));
export const db = drizzle({ client: sql, schema });
