import { TaskRecord, TasksRepository } from "@/core/ports/tasks.repository";
import { CreateTaskInput } from "@/types/tasks";

export function createMockedTasksRepository(
  overrides: Partial<TasksRepository> = {},
): TasksRepository {
  return {
    findById: vi.fn(async (): Promise<TaskRecord | null> => null),
    findAllByUser: vi.fn(async (): Promise<TaskRecord[]> => []),
    create: vi.fn(
      async (input: CreateTaskInput): Promise<TaskRecord> => ({
        id: 1,
        name: input.name,
        isCompleted: false,
      }),
    ),
    update: vi.fn(async (): Promise<void> => undefined),
    ...overrides,
  };
}
