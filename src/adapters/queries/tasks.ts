import { getTaskRepository } from "@/adapters";
import { createTaskService } from "@/core/services/task.service";

export async function getTasks(userId: string) {
  const tasksService = createTaskService(getTaskRepository());

  return tasksService.getTasks(userId);
}
