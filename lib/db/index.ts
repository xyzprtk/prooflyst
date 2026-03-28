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
let checkPromise: Promise<boolean> | null = null;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  // If already checking, wait for result
  if (checkPromise) {
    return checkPromise;
  }

  // Start retry loop
  checkPromise = (async () => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await sql`SELECT 1`;
        dbAvailable = true;
        return true;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < maxRetries) {
          const delay = attempt * 1000;
          console.log(`Database connection attempt ${attempt} failed, retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }

    // All retries failed
    dbAvailable = false;
    console.error("Database connection failed:", lastError?.message);
    throw new Error(
      "Database is unavailable. Please ensure DATABASE_URL is configured correctly and the database is running."
    );
  })();

  try {
    return await checkPromise;
  } finally {
    checkPromise = null;
  }
}

export function resetDbAvailableFlag() {
  dbAvailable = null;
}