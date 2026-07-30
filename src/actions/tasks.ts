"use server";

import { db, taskInsertSchema, tasks } from "@/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UpdateTaskInput, CreateTaskInput } from "@/types/tasks";
import { ActionState } from "@/types/action-state";
import { requireSession } from "@/lib/require-session";

export async function toggleTask(id: number) {
  const { user } = await requireSession();

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.id, id), eq(tasks.userId, user.id)),
    columns: {
      isCompleted: true,
    },
  });

  if (!task) {
    throw new Error("Tarefa não encontrada.");
  }

  const data: UpdateTaskInput = {
    isCompleted: !task.isCompleted,
  };

  await db
    .update(tasks)
    .set(data)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)));

  revalidatePath("/tasks");
}

export async function deleteTask(id: number) {
  const { user } = await requireSession();

  const data: UpdateTaskInput = {
    deletedAt: new Date(),
  };

  await db
    .update(tasks)
    .set(data)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)));

  revalidatePath("/tasks");
}

export async function createTask(
  _: ActionState<CreateTaskInput>,
  formData: FormData,
): Promise<ActionState<CreateTaskInput>> {
  const { user } = await requireSession();

  const data = Object.fromEntries(formData);

  const parsed = taskInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const [task] = await db
    .insert(tasks)
    .values({
      ...parsed.data,
      userId: user.id,
    })
    .returning();

  revalidatePath("/tasks");

  return {
    success: true,
    message: `Tarefa ${task.name} criada com sucesso.`,
  };
}
