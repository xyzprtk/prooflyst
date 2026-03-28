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

// Track if DB tables exist
let dbTablesExist: boolean | null = null;
let dbCheckPromise: Promise<boolean> | null = null;

class DatabaseUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export async function isDbAvailable(): Promise<boolean> {
  if (dbTablesExist !== null) {
    if (!dbTablesExist) {
      throw new DatabaseUnavailableError(
        "Database is unavailable. Please ensure DATABASE_URL is configured correctly and the database is running."
      );
    }
    return true;
  }

  // Only check once at a time
  if (dbCheckPromise) {
    return dbCheckPromise;
  }

  dbCheckPromise = (async () => {
    try {
      // Try to query the sites table to see if it exists
      await sql`SELECT 1 FROM sites LIMIT 1`;
      dbTablesExist = true;
      return true;
    } catch {
      dbTablesExist = false;
      throw new DatabaseUnavailableError(
        "Database is unavailable. Please ensure DATABASE_URL is configured correctly and the database is running."
      );
    } finally {
      dbCheckPromise = null;
    }
  })();

  return dbCheckPromise;
}

export function resetDbAvailableFlag() {
  dbTablesExist = null;
}