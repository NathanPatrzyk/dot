import { createTasksRepository } from "./tasks.repository";
import { users } from "@/db/schema";
import type { TasksRepository } from "@/core/ports/tasks.repository";
import { createTestDb, TestDb } from "@/test-utils/db.test-util";

describe("tasks repository (sqlite)", () => {
  let sqlite: TestDb["sqlite"];
  let db: TestDb["db"];
  let repository: TasksRepository;

  beforeEach(() => {
    ({ db, sqlite } = createTestDb());
    repository = createTasksRepository(() => db);

    db.insert(users)
      .values({ id: "john-doe", name: "John Doe", email: "john@doe.dev" })
      .run();
    db.insert(users)
      .values({ id: "jane-doe", name: "Jane Doe", email: "jane@doe.dev" })
      .run();
  });

  afterEach(() => sqlite.close());

  it("should create a task and list it for the owner", async () => {
    const task = await repository.create(
      { name: "my-fantastic-task" },
      "john-doe",
    );

    expect(task).toMatchObject({
      id: 1,
      name: "my-fantastic-task",
      isCompleted: false,
    });

    const all = await repository.findAllByUser("john-doe");
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ name: "my-fantastic-task" });
  });

  it("should hide soft-deleted tasks and tasks of other users", async () => {
    const task = await repository.create(
      { name: "my-fantastic-task" },
      "john-doe",
    );
    await repository.create({ name: "ephemeral-task" }, "jane-doe");
    await repository.update(task.id, "john-doe", { deletedAt: new Date() });

    const all = await repository.findAllByUser("john-doe");

    expect(all).toHaveLength(0);
  });

  it("should not return a task that belongs to another user", async () => {
    const task = await repository.create(
      { name: "my-fantastic-task" },
      "john-doe",
    );

    await expect(repository.findById(task.id, "jane-doe")).resolves.toBeNull();
    expect(await repository.findById(task.id, "john-doe")).not.toBeNull();
  });

  it("should update the task scoped to the owner", async () => {
    const task = await repository.create(
      { name: "my-fantastic-task" },
      "john-doe",
    );

    await repository.update(task.id, "john-doe", { isCompleted: true });

    expect(await repository.findById(task.id, "john-doe")).toMatchObject({
      isCompleted: true,
    });
  });

  it("should not update a task of another user", async () => {
    const task = await repository.create(
      { name: "my-fantastic-task" },
      "john-doe",
    );

    await repository.update(task.id, "jane-doe", { isCompleted: true });

    expect(await repository.findById(task.id, "john-doe")).toMatchObject({
      isCompleted: false,
    });
  });
});
