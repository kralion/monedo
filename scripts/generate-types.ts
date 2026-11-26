// @ts-nocheck
import { join } from "node:path";

const [schema = "public", output = join("src", "types", `${schema}.types.ts`)] = Bun.argv.slice(2);
const dbUrl = Bun.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ Error: DATABASE_URL is not set in the environment or .env file.");
  process.exit(1);
}

const proc = Bun.spawnSync(
  ["bunx", "@neondatabase/neon-js", "gen-types", "--db-url", dbUrl, "--schema", schema, "--output", output],
  { stdio: ["inherit", "inherit", "inherit"] }
);

process.exit(proc.exitCode ?? 0);
