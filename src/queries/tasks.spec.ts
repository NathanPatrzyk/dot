import { createMockedTasksRepository } from "@/adapters/shared/tasks.repository.mock";

vi.mock("@/adapters", () => ({ getTasksRepository: vi.fn() }));

import { getTasks } from "@/queries/tasks";
import { getTasksRepository } from "@/adapters";
import { createTasks } from "@/types/tasks.mock";

describe("tasks queries", () => {
  beforeEach(() => {
    vi.mocked(getTasksRepository).mockReturnValue(
      createMockedTasksRepository(),
    );
  });

  it("should return the tasks belonging to the given user", async () => {
    const repository = createMockedTasksRepository({
      findAllByUser: vi.fn(async () => createTasks()),
    });
    vi.mocked(getTasksRepository).mockReturnValue(repository);

    const tasks = await getTasks("john-doe");

    expect(tasks).toEqual(createTasks());
    expect(repository.findAllByUser).toHaveBeenCalledWith("john-doe");
  });
});
