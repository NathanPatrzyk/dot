import { db } from "@/db";
import { getTasks } from "./tasks";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
  },
  tasks: {},
}));

jest.mock("drizzle-orm", () => ({
  desc: jest.fn(),
}));

const mockSelect = db.select as jest.Mock;

function mockTasksResult(result: unknown[]) {
  const orderByMock = jest.fn().mockResolvedValue(result);
  const fromMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
  mockSelect.mockReturnValue({ from: fromMock });
}

describe("getTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns tasks with total, completed and porcentage", async () => {
    mockTasksResult([
      { id: 1, name: "Tarefa 1", isCompleted: true },
      { id: 2, name: "Tarefa 2", isCompleted: false },
      { id: 3, name: "Tarefa 3", isCompleted: true },
    ]);

    const result = await getTasks();

    expect(result.total).toBe(3);
    expect(result.completed).toBe(2);
    expect(result.porcentage).toBeCloseTo(66.66, 1);
    expect(result.tasks).toHaveLength(3);
  });

  it("returns porcentage 0 when there are no tasks", async () => {
    mockTasksResult([]);

    const result = await getTasks();

    expect(result.total).toBe(0);
    expect(result.completed).toBe(0);
    expect(result.porcentage).toBe(0);
    expect(result.tasks).toEqual([]);
  });

  it("returns porcentage 100 when all tasks are completed", async () => {
    mockTasksResult([
      { id: 1, name: "Tarefa 1", isCompleted: true },
      { id: 2, name: "Tarefa 2", isCompleted: true },
    ]);

    const result = await getTasks();

    expect(result.porcentage).toBe(100);
  });
});
