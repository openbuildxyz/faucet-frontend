import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getServerEnv } from "./env";
import * as schema from "./schema";

type GlobalWithDb = typeof globalThis & {
  faucetSql?: postgres.Sql;
};

const globalForDb = globalThis as GlobalWithDb;

function getSqlClient() {
  if (!globalForDb.faucetSql) {
    globalForDb.faucetSql = postgres(getServerEnv().DATABASE_URL, {
      connect_timeout: 10,
      idle_timeout: 20,
      max: 5,
      prepare: false,
    });
  }

  return globalForDb.faucetSql;
}

export function getDb() {
  return drizzle(getSqlClient(), { schema });
}
