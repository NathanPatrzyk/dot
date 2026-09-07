"use server";

import { taskInsertSchema } from "@/db";
import { revalidatePath } from "next/cache";
import { CreateTaskInput } from "@/types/tasks";
import { ActionState } from "@/types/action-state";
import { requireSession } from "@/lib/require-session";
import { createTasksService } from "@/core/services/tasks-service";
import { getTaskRepository } from "@/adapters";

export async function toggleTask(id: number) {
  const { user } = await requireSession();

  if (!id || typeof id !== "number") {
    throw new Error("Id inválido.");
  }

  const tasksService = createTasksService(getTaskRepository());
  await tasksService.toggleTask(id, user.id);

  revalidatePath("/tasks");
}

export async function deleteTask(id: number) {
  const { user } = await requireSession();

  if (!id || typeof id !== "number") {
    throw new Error("Id inválido.");
  }

  const tasksService = createTasksService(getTaskRepository());
  await tasksService.deleteTask(id, user.id);

  revalidatePath("/tasks");
}

export async function createTask(
  _: ActionState<CreateTaskInput>,
  formData: FormData,
): Promise<ActionState<CreateTaskInput>> {
  const { user } = await requireSession();

  if (!(formData instanceof FormData)) {
    return {
      success: false,
      message: "Dados inválidos.",
    };
  }

  const data = Object.fromEntries(formData);
  const parsed = taskInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const tasksService = createTasksService(getTaskRepository());
  const task = await tasksService.createTask(parsed.data, user.id);

  if (!task) {
    return {
      success: false,
      message: "Erro ao criar tarefa.",
    };
  }

  revalidatePath("/tasks");

  return {
    success: true,
    message: `Tarefa ${task.name} criada com sucesso.`,
  };
}
