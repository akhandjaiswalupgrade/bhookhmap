import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Singleton connection — Next.js dev server may reload modules; we cache on globalThis.
declare global {
  // eslint-disable-next-line no-var
  var __bhookhmap_db: ReturnType<typeof postgres> | undefined;
}

function getClient() {
  if (global.__bhookhmap_db) return global.__bhookhmap_db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Set it in .env (local dev) or in your Vercel env vars (production).",
    );
  }
  const client = postgres(url, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  if (process.env.NODE_ENV !== "production") {
    global.__bhookhmap_db = client;
  }
  return client;
}

export const db = drizzle(getClient(), { schema });
export { schema };
