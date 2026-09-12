import type { TaskView } from "@/types/tasks";

export function createMockedTaskView(
  overrides: Partial<TaskView> = {},
): TaskView {
  return {
    id: 1,
    name: "my-fantastic-task",
    isCompleted: false,
    ...overrides,
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
