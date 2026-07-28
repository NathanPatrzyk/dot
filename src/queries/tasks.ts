import { db, tasks } from "@/db";
import { and, desc, eq, isNull } from "drizzle-orm";

export async function getAllTasks() {
  const allTasks = await db
    .select()
    .from(tasks)
    .where(isNull(tasks.deletedAt))
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

export async function getPendingTasks() {
  const pendingTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.isCompleted, false), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.id));

  return {
    pendingTasks,
  };
}

export async function getCompletedTasks() {
  const completedTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.isCompleted, true), isNull(tasks.deletedAt)))
    .orderBy(desc(tasks.id));

  return {
    completedTasks,
  };
}
