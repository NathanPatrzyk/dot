"use server";

import { revalidatePath } from "next/cache";
import { CreateTaskInput, createTaskInputSchema } from "@/core/entities/task";
import { ActionState } from "@/view/types/action-state";
import { requireSession } from "@/adapters/auth/session";
import { createTaskService } from "@/core/services/task.service";
import { getTaskRepository } from "@/adapters";

export async function toggleTask(id: number) {
  const { user } = await requireSession();

  if (!id || typeof id !== "number") {
    throw new Error("Id inválido.");
  }

  const taskService = createTaskService(getTaskRepository());
  await taskService.toggleTask(id, user.id);

  revalidatePath("/categories/[slug]/tasks", "page");
}

export async function deleteTask(id: number) {
  const { user } = await requireSession();

  if (!id || typeof id !== "number") {
    throw new Error("Id inválido.");
  }

  const taskService = createTaskService(getTaskRepository());
  await taskService.deleteTask(id, user.id);

  revalidatePath("/categories/[slug]/tasks", "page");
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
  const parsed = createTaskInputSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message,
    };
  }

  const taskService = createTaskService(getTaskRepository());
  const task = await taskService.createTask(parsed.data, user.id);

  if (!task) {
    return {
      success: false,
      message: "Erro ao criar tarefa.",
    };
  }

  revalidatePath("/categories/[slug]/tasks", "page");

  return {
    success: true,
    message: `Tarefa ${task.name} criada com sucesso.`,
  };
}
