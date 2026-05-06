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
