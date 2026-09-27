import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Client-side Drizzle instance. There is no server layer anymore, so every
// query runs in the browser with the credentials below. `VITE_DATABASE_URL`
// is inlined into the bundle at build time — do not use a role that has more
// access than the app needs.
function getDatabaseUrl(): string {
  const url = import.meta.env.VITE_DATABASE_URL;

  if (!url) {
    throw new Error(
      "VITE_DATABASE_URL is not set. Define it in .env so the client can reach the database.",
    );
  }

  return url;
}

const sql = neon(getDatabaseUrl());
export const db = drizzle({ client: sql });
