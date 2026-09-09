import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";
import type { AppDatabase } from "@/adapters/shared/types";

let cached: AppDatabase | undefined;

export function getDb(): AppDatabase {
  if (!cached) {
    const sqlite = new Database(process.env.DATABASE_URL ?? "./data/app.db");
    cached = drizzle(sqlite, { schema });
  }

  return cached;
}
