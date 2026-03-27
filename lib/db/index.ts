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

let dbAvailable: boolean | null = null;

export async function isDbAvailable(): Promise<boolean> {
  if (dbAvailable !== null) {
    return dbAvailable;
  }
  
  try {
    // Simple query to check connectivity
    await sql`SELECT 1`;
    dbAvailable = true;
    return true;
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.log("Database unavailable - using local store fallback");
    }
    dbAvailable = false;
    return false;
  }
}

export function resetDbAvailableFlag() {
  dbAvailable = null;
}
