import { createMockedTask } from "@/__test__/task.mock";
import { CreateTaskInput, Task, TaskView } from "@/core/entities/task";
import { TaskRepository } from "@/core/ports/task-repository.port";

export function createMockedTaskRepository(
  overrides: Partial<TaskRepository> = {},
): TaskRepository {
  return {
    findById: vi.fn(async (): Promise<TaskView | null> => null),
    findAllByUser: vi.fn(async (): Promise<TaskView[]> => []),
    create: vi.fn(
      async (input: CreateTaskInput): Promise<Task> =>
        createMockedTask({ name: input.name, categoryId: input.categoryId }),
    ),
    update: vi.fn(async (): Promise<void> => undefined),
    ...overrides,
  };
}
