// TODO: Migrate all `import { db } from "@/db"` to serverFns using lib/db dot server.
// This file is client-bundled and exposes DATABASE_URL — do not add new usages.
// New code must use db from lib/db.server inside createServerFn only.
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

function getUrl(): string {
  const serverUrl =
    typeof process !== "undefined" ? process.env.DATABASE_URL : undefined;
  const viteUrl = (import.meta as unknown as { env: Record<string, string> })
    .env?.VITE_DATABASE_URL;
  const url = serverUrl ?? viteUrl;
  if (!url) throw new Error("DATABASE_URL / VITE_DATABASE_URL missing");
  return url;
}

const sql = neon(getUrl());
export const db = drizzle({ client: sql });
