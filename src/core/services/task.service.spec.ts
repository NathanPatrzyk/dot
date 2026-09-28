import { createMockedTaskRepository } from "@/adapters/repositories/task.repository.mock";
import { createTaskService } from "@/core/services/task.service";

describe("task service", () => {
  it("should throw when toggling a task that does not exist", async () => {
    const repository = createMockedTaskRepository();
    const service = createTaskService(repository);

    await expect(service.toggleTask(404, "john-doe")).rejects.toThrow(
      "Tarefa não encontrada",
    );

    expect(repository.findById).toHaveBeenCalledWith(404, "john-doe");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("should toggle isCompleted and propagate the update", async () => {
    const repository = createMockedTaskRepository({
      findById: vi.fn(async () => ({
        id: 12,
        name: "my-fantastic-task",
        isCompleted: false,
        categoryId: null,
      })),
    });

    await createTaskService(repository).toggleTask(12, "john-doe");

    expect(repository.findById).toHaveBeenCalledWith(12, "john-doe");
    expect(repository.update).toHaveBeenCalledWith(12, "john-doe", {
      isCompleted: true,
    });
  });

  it("should soft-delete a task with a deletedAt timestamp", async () => {
    const repository = createMockedTaskRepository();

    await createTaskService(repository).deleteTask(12, "john-doe");

    expect(repository.update).toHaveBeenCalledWith(12, "john-doe", {
      deletedAt: expect.any(Date),
    });
  });

  it("should create a task and forward the input", async () => {
    const repository = createMockedTaskRepository();

    const task = await createTaskService(repository).createTask(
      { name: "my-fantastic-task" },
      "john-doe",
    );

    expect(task).toMatchObject({
      id: 1,
      name: "my-fantastic-task",
      isCompleted: false,
    });
    expect(repository.create).toHaveBeenCalledWith(
      { name: "my-fantastic-task" },
      "john-doe",
    );
  });

  it("should return the tasks belonging to the given user", async () => {
    const repository = createMockedTaskRepository({
      findAllByUser: vi.fn(async () => [
        { id: 12, name: "my-fantastic-task", isCompleted: false, categoryId: null },
      ]),
    });

    const tasks = await createTaskService(repository).getTasks("john-doe");

    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ name: "my-fantastic-task" });
    expect(repository.findAllByUser).toHaveBeenCalledWith("john-doe");
  });
});
