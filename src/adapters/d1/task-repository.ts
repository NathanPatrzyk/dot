import { CommonTaskRepository } from "@/core/ports/common-task-repository";
import { getDb } from "./client";
import { and, eq } from "drizzle-orm";
import { tasks } from "@/db";
import { CreateTaskInput, UpdateTaskInput } from "@/types/tasks";

export function createD1TaskRepository(): CommonTaskRepository {
  async function findById(id: number, userId: string) {
    const db = getDb();

    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, userId)),
      columns: { id: true, name: true, isCompleted: true },
    });

    return task ?? null;
  }

  async function create(input: CreateTaskInput, userId: string) {
    const db = getDb();

    const [task] = await db
      .insert(tasks)
      .values({ ...input, userId })
      .returning();

    return task;
  }

  async function update(id: number, userId: string, input: UpdateTaskInput) {
    const db = getDb();

    await db
      .update(tasks)
      .set(input)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  }

  return { findById, create, update };
}
