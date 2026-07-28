import { db } from "@/db";
import { getAllTasks, getPendingTasks, getCompletedTasks } from "./tasks";

jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
  },
  tasks: {},
}));

jest.mock("drizzle-orm", () => ({
  desc: jest.fn(),
  eq: jest.fn(),
  and: jest.fn(),
  isNull: jest.fn(),
}));

const mockSelect = db.select as jest.Mock;

function mockTasksResult(result: unknown[]) {
  const orderByMock = jest.fn().mockResolvedValue(result);
  const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
  const fromMock = jest.fn().mockReturnValue({ where: whereMock });
  mockSelect.mockReturnValue({ from: fromMock });
}

describe("getAllTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns tasks with total, completed and porcentage", async () => {
    mockTasksResult([
      { id: 1, name: "Tarefa 1", isCompleted: true },
      { id: 2, name: "Tarefa 2", isCompleted: false },
      { id: 3, name: "Tarefa 3", isCompleted: true },
    ]);

    const result = await getAllTasks();

    expect(result.total).toBe(3);
    expect(result.completed).toBe(2);
    expect(result.porcentage).toBeCloseTo(66.66, 1);
    expect(result.allTasks).toHaveLength(3);
  });

  it("returns porcentage 0 when there are no tasks", async () => {
    mockTasksResult([]);

    const result = await getAllTasks();

    expect(result.total).toBe(0);
    expect(result.completed).toBe(0);
    expect(result.porcentage).toBe(0);
    expect(result.allTasks).toEqual([]);
  });

  it("returns porcentage 100 when all tasks are completed", async () => {
    mockTasksResult([
      { id: 1, name: "Tarefa 1", isCompleted: true },
      { id: 2, name: "Tarefa 2", isCompleted: true },
    ]);

    const result = await getAllTasks();

    expect(result.porcentage).toBe(100);
  });
});

describe("getPendingTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns only pending tasks", async () => {
    mockTasksResult([{ id: 1, name: "Tarefa 1", isCompleted: false }]);

    const result = await getPendingTasks();

    expect(result.pendingTasks).toHaveLength(1);
    expect(result.pendingTasks[0].isCompleted).toBe(false);
  });
});

describe("getCompletedTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns only completed tasks", async () => {
    mockTasksResult([{ id: 1, name: "Tarefa 1", isCompleted: true }]);

    const result = await getCompletedTasks();

    expect(result.completedTasks).toHaveLength(1);
    expect(result.completedTasks[0].isCompleted).toBe(true);
  });
});
