import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

function createTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.warn(
      "[Turso] TURSO_DATABASE_URL is not set. Using placeholder client.\n" +
        "Database queries will fail until you add your Turso credentials to .env.local\n" +
        "Get started at https://console.turso.tech"
    );
    // Return a placeholder client so the module loads during build.
    // isDbAvailable() will correctly report false, falling back to local-store.
    return createClient({
      url: "http://placeholder.turso.io",
      authToken: "placeholder",
    });
  }

  return createClient({ url, authToken });
}

const client = createTursoClient();
export const db = drizzle({ client, schema });
export { client };

// Track if DB tables exist
let dbTablesExist: boolean | null = null;
let dbCheckPromise: Promise<boolean> | null = null;

export async function isDbAvailable(): Promise<boolean> {
  if (dbTablesExist !== null) {
    return dbTablesExist;
  }

  // Only check once at a time
  if (dbCheckPromise) {
    return dbCheckPromise;
  }

  dbCheckPromise = (async () => {
    try {
      // Try to query the sites table to see if it exists
      await client.execute("SELECT 1 FROM sites LIMIT 1");
      dbTablesExist = true;
      return true;
    } catch {
      if (process.env.NODE_ENV === "development") {
        console.log("Database tables not found - using local store fallback");
      }
      dbTablesExist = false;
      return false;
    } finally {
      dbCheckPromise = null;
    }
  })();

  return dbCheckPromise;
}

export function resetDbAvailableFlag() {
  dbTablesExist = null;
}
