import { db, taskInsertSchema } from "@/db";
import { revalidatePath } from "next/cache";
import { toggleTask, createTask, deleteTask } from "./tasks";

jest.mock("@/db", () => ({
  db: {
    query: {
      tasks: {
        findFirst: jest.fn(),
      },
    },
    update: jest.fn(),
    insert: jest.fn(),
  },
  tasks: {},
  taskInsertSchema: {
    parse: jest.fn(),
  },
  taskUpdateSchema: {
    parse: jest.fn(),
  },
}));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

const mockFindFirst = db.query.tasks.findFirst as jest.Mock;
const mockUpdate = db.update as jest.Mock;
const mockInsert = db.insert as jest.Mock;
const mockParse = taskInsertSchema.parse as jest.Mock;

describe("toggleTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("toggles isCompleted and revalidates", async () => {
    mockFindFirst.mockResolvedValue({ isCompleted: false });

    const whereMock = jest.fn().mockResolvedValue(undefined);
    const setMock = jest.fn().mockReturnValue({ where: whereMock });
    mockUpdate.mockReturnValue({ set: setMock });

    await toggleTask(1);

    expect(setMock).toHaveBeenCalledWith({ isCompleted: true });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("throws when task is not found", async () => {
    mockFindFirst.mockResolvedValue(undefined);

    await expect(toggleTask(999)).rejects.toThrow("Tarefa não encontrada.");
  });
});

describe("deleteTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("soft deletes the task by setting deletedAt and revalidates", async () => {
    const whereMock = jest.fn().mockResolvedValue(undefined);
    const setMock = jest.fn().mockReturnValue({ where: whereMock });
    mockUpdate.mockReturnValue({ set: setMock });

    await deleteTask(1);

    expect(setMock).toHaveBeenCalledWith({
      deletedAt: expect.any(Date),
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });
});

describe("createTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a task and returns a success message", async () => {
    mockParse.mockReturnValue({ name: "Tarefa 1" });

    const returningMock = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Tarefa 1" }]);
    const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
    mockInsert.mockReturnValue({ values: valuesMock });

    const formData = new FormData();
    formData.set("name", "Tarefa 1");

    const result = await createTask({ success: false, message: "" }, formData);

    expect(valuesMock).toHaveBeenCalledWith({ name: "Tarefa 1" });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(result).toEqual({
      success: true,
      message: "Tarefa Tarefa 1 criada com sucesso.",
    });
  });
});
