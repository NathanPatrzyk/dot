import { db, tasks } from "@/db";
import { desc } from "drizzle-orm";

export async function getTasks() {
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.id));

  const total = allTasks.length;
  const completed = allTasks.filter((task) => task.isCompleted).length;
  const porcentage = total === 0 ? 0 : (completed / total) * 100;

  return {
    tasks: allTasks,
    total,
    completed,
    porcentage,
  };
}
