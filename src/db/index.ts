import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

export function getDb() {
  if (globalForDb.db) {
    return globalForDb.db;
  }
  const client = postgres(getConnectionString(), { max: 10 });
  globalForDb.client = client;
  globalForDb.db = drizzle(client, { schema });
  return globalForDb.db;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.length);
}
