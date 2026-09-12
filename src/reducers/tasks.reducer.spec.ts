import { createMockedTaskView, createTasks } from "@/types/tasks.mock";
import { tasksReducer } from "@/reducers/tasks.reducer";

describe("tasks reducer", () => {
  it("should prepend the new task when the action type is create", () => {
    const next = tasksReducer(createTasks(), {
      type: "create",
      task: createMockedTaskView({ id: -Date.now() }),
    });

    expect(next).toHaveLength(3);
    expect(next[0]).toMatchObject({ name: "my-fantastic-task" });
    expect(next.slice(1)).toHaveLength(2);
  });

  it("should toggle isCompleted of the matching task", () => {
    const next = tasksReducer(createTasks(), { type: "toggle", id: 1 });

    expect(next[0]).toMatchObject({
      id: 1,
      name: "write-the-tests",
      isCompleted: true,
    });
  });

  it("should not change tasks with different ids on toggle", () => {
    const next = tasksReducer(createTasks(), { type: "toggle", id: 1 });

    expect(next[1]).toEqual(
      createMockedTaskView({
        id: 2,
        name: "refactor-deletion-service",
        isCompleted: true,
      }),
    );
  });

  it("should not mutate the original state", () => {
    const state = createTasks();
    const before = structuredClone(state);

    tasksReducer(state, { type: "toggle", id: 1 });

    expect(state).toEqual(before);
  });

  it("should remove the task with the given id", () => {
    const next = tasksReducer(createTasks(), { type: "delete", id: 2 });

    expect(next).toEqual([
      createMockedTaskView({ id: 1, name: "write-the-tests" }),
    ]);
  });

  it("should not remove tasks with different ids", () => {
    const next = tasksReducer(createTasks(), { type: "delete", id: 404 });

    expect(next).toEqual(createTasks());
  });
});
