import { TasksRepository } from "@/core/ports/tasks.repository";
import { CreateTaskInput } from "@/types/tasks";

export function createTasksService(tasksRepository: TasksRepository) {
  async function getTasks(userId: string) {
    return tasksRepository.findAllByUser(userId);
  }

  async function toggleTask(id: number, userId: string) {
    const task = await tasksRepository.findById(id, userId);

    if (!task) {
      throw new Error("Tarefa não encontrada.");
    }

    await tasksRepository.update(id, userId, { isCompleted: !task.isCompleted });
  }

  async function deleteTask(id: number, userId: string) {
    await tasksRepository.update(id, userId, { deletedAt: new Date() });
  }

  async function createTask(input: CreateTaskInput, userId: string) {
    return tasksRepository.create(input, userId);
  }

  return { getTasks, toggleTask, deleteTask, createTask };
}
