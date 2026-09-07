import { CommonTaskRepository } from "../ports/common-task-repository";
import { CreateTaskInput } from "@/types/tasks";

export function createTasksService(taskRepository: CommonTaskRepository) {
  async function toggleTask(id: number, userId: string) {
    const task = await taskRepository.findById(id, userId);

    if (!task) {
      throw new Error("Tarefa não encontrada.");
    }

    await taskRepository.update(id, userId, { isCompleted: !task.isCompleted });
  }

  async function deleteTask(id: number, userId: string) {
    await taskRepository.update(id, userId, { deletedAt: new Date() });
  }

  async function createTask(input: CreateTaskInput, userId: string) {
    return taskRepository.create(input, userId);
  }

  return { toggleTask, deleteTask, createTask };
}
