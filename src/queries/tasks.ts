import { getTasksRepository } from "@/adapters";
import { createTasksService } from "@/core/services/tasks.service";

export async function getTasks(userId: string) {
  const tasksService = createTasksService(getTasksRepository());

  return tasksService.getTasks(userId);
}
