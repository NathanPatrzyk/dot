import { getTaskRepository } from "@/adapters";
import { createTasksService } from "@/core/services/tasks-service";

export async function getTasks(userId: string) {
  const tasksService = createTasksService(getTaskRepository());

  return tasksService.getTasks(userId);
}
