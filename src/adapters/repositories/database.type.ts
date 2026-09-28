import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type * as schema from "@/adapters/db/schema";

export type AppDatabase = BaseSQLiteDatabase<
  "sync" | "async",
  unknown,
  typeof schema
>;

export type GetDb = () => AppDatabase;
