import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Server-only DB instance. Never import this file from client components.
// Use createServerFn to expose data to the client.
function getDatabaseUrl(): string {
  const url =
    // Netlify / Vite server env
    (typeof process !== "undefined" ? process.env.DATABASE_URL : undefined) ??
    // Fallback for local dev if only VITE_ var is set (deprecated)
    (import.meta as unknown as { env: Record<string, string> }).env?.VITE_DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Define DATABASE_URL in .env (server-only), not VITE_DATABASE_URL.",
    );
  }
  return url;
}

const sql = neon(getDatabaseUrl());
export const db = drizzle({ client: sql });
