import { and, desc, eq, isNull } from "drizzle-orm";
import { tasks } from "@/db";
import { getDb } from "@/adapters/sqlite/client";

export async function getTasks(userId: string) {
  return getDb()
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.id));
}
