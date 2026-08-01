import { db, tasks } from "@/db";
import { and, desc, eq, isNull } from "drizzle-orm";

export async function getAllTasks(userId: string) {
  const allTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.id));

  const total = allTasks.length;
  const completed = allTasks.filter((task) => task.isCompleted).length;
  const porcentage = total === 0 ? 0 : (completed / total) * 100;

  return {
    allTasks,
    total,
    completed,
    porcentage,
  };
}

export async function getPendingTasks(userId: string) {
  const pendingTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.isCompleted, false),
        isNull(tasks.deletedAt),
      ),
    )
    .orderBy(desc(tasks.id));

  return {
    pendingTasks,
  };
}

export async function getCompletedTasks(userId: string) {
  const completedTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.isCompleted, true),
        isNull(tasks.deletedAt),
      ),
    )
    .orderBy(desc(tasks.id));

  return {
    completedTasks,
  };
}
