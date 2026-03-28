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

// Track if DB connection is valid
let dbAvailable: boolean | null = null;

export async function isDbAvailable(): Promise<boolean> {
  // Return cached result if available
  if (dbAvailable !== null) {
    if (!dbAvailable) {
      throw new Error(
        "Database is unavailable. Please ensure DATABASE_URL is configured correctly and the database is running."
      );
    }
    return true;
  }

  // Try to connect
  try {
    await sql`SELECT 1`;
    dbAvailable = true;
    return true;
  } catch (error) {
    dbAvailable = false;
    console.error("Database connection failed:", error instanceof Error ? error.message : error);
    throw new Error(
      "Database is unavailable. Please ensure DATABASE_URL is configured correctly and the database is running."
    );
  }
}

export function resetDbAvailableFlag() {
  dbAvailable = null;
}