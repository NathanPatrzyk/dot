"use server";

import { db, taskInsertSchema, tasks, taskUpdateSchema } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UpdateTaskInput, CreateTaskInput } from "@/types/tasks";
import { ActionState } from "@/types/action-state";

export async function toggleTask(id: number) {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    columns: {
      isCompleted: true,
    },
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  await db
    .update(tasks)
    .set({
      isCompleted: !task.isCompleted,
    })
    .where(eq(tasks.id, id));

  revalidatePath("/");
}

export async function createTask(
  _: ActionState<CreateTaskInput>,
  formData: FormData,
): Promise<ActionState<CreateTaskInput>> {
  const data = Object.fromEntries(formData);
  const parsed = taskInsertSchema.parse(data);

  const [task] = await db.insert(tasks).values(parsed).returning();

  revalidatePath("/");

  return {
    success: true,
    message: `Tarefa ${task.name} criada com sucesso.`,
  };
}
