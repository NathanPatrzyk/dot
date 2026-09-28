import { createMockedTaskRepository } from "@/adapters/repositories/task.repository.mock";

vi.mock("@/adapters", () => ({ getTaskRepository: vi.fn() }));

import { getTasks } from "@/adapters/queries/tasks";
import { getTaskRepository } from "@/adapters";
import { createTasks } from "@/__test__/task.mock";

describe("task queries", () => {
  beforeEach(() => {
    vi.mocked(getTaskRepository).mockReturnValue(createMockedTaskRepository());
  });

  it("should return the tasks belonging to the given user", async () => {
    const repository = createMockedTaskRepository({
      findAllByUser: vi.fn(async () => createTasks()),
    });
    vi.mocked(getTaskRepository).mockReturnValue(repository);

    const tasks = await getTasks("john-doe");

    expect(tasks).toEqual(createTasks());
    expect(repository.findAllByUser).toHaveBeenCalledWith("john-doe");
  });
});
