import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const migrationsDir = path.join(process.cwd(), "migrations");
const migrationFiles = (await readdir(migrationsDir))
  .filter((file) => file.endsWith(".sql"))
  .sort();

const sql = postgres(databaseUrl, {
  max: 1,
  prepare: false,
});

try {
  for (const file of migrationFiles) {
    const migration = await readFile(path.join(migrationsDir, file), "utf8");
    await sql.unsafe(migration);
    console.log(`Applied ${file}`);
  }
} finally {
  await sql.end();
}
