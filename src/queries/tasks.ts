import { and, desc, eq, isNull } from "drizzle-orm";
import { getDb, tasks } from "@/db";

export async function getTasks(userId: string) {
  return getDb()
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.id));
}
