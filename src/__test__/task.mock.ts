import type { Task, TaskView } from "@/core/entities/task";

export function createMockedTaskView(overrides: Partial<TaskView> = {}): TaskView {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? "my-fantastic-task",
    isCompleted: overrides.isCompleted ?? false,
    categoryId: overrides.categoryId ?? null,
  };
}

export function createMockedTask(overrides: Partial<Task> = {}): Task {
  return {
    ...createMockedTaskView(overrides),
    userId: overrides.userId ?? "john-doe",
    createdAt: overrides.createdAt ?? new Date("2026-03-15T12:00:00.000Z"),
    deletedAt: overrides.deletedAt ?? null,
  };
}

export function createTasks(
  overrides: Partial<TaskView>[] = [
    { id: 1, name: "write-the-tests" },
    { id: 2, name: "refactor-deletion-service", isCompleted: true },
  ],
): TaskView[] {
  return overrides.map((override, index) =>
    createMockedTaskView({ id: index + 1, ...override }),
  );
}
