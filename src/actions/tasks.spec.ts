import { db, taskInsertSchema } from "@/db";
import { revalidatePath } from "next/cache";
import { toggleTask, createTask, deleteTask } from "./tasks";

jest.mock("@/lib/require-session", () => ({
  requireSession: jest.fn().mockResolvedValue({
    user: {
      id: "user-1",
    },
  }),
}));

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
  tasks: {
    id: "id",
    userId: "userId",
  },
  taskInsertSchema: {
    safeParse: jest.fn(),
  },
}));

jest.mock("drizzle-orm", () => ({
  and: jest.fn((...args) => args),
  eq: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

const mockFindFirst = db.query.tasks.findFirst as jest.Mock;
const mockUpdate = db.update as jest.Mock;
const mockInsert = db.insert as jest.Mock;
const mockSafeParse = taskInsertSchema.safeParse as jest.Mock;

describe("toggleTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("toggles isCompleted and revalidates", async () => {
    mockFindFirst.mockResolvedValue({
      isCompleted: false,
    });

    const whereMock = jest.fn().mockResolvedValue(undefined);

    const setMock = jest.fn().mockReturnValue({
      where: whereMock,
    });

    mockUpdate.mockReturnValue({
      set: setMock,
    });

    await toggleTask(1);

    expect(setMock).toHaveBeenCalledWith({
      isCompleted: true,
    });

    expect(revalidatePath).toHaveBeenCalledWith("/tasks");
  });

  it("toggles completed task to false", async () => {
    mockFindFirst.mockResolvedValue({
      isCompleted: true,
    });

    const setMock = jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    });

    mockUpdate.mockReturnValue({
      set: setMock,
    });

    await toggleTask(1);

    expect(setMock).toHaveBeenCalledWith({
      isCompleted: false,
    });
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

  it("soft deletes the task", async () => {
    const setMock = jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    });

    mockUpdate.mockReturnValue({
      set: setMock,
    });

    await deleteTask(1);

    expect(setMock).toHaveBeenCalledWith({
      deletedAt: expect.any(Date),
    });

    expect(revalidatePath).toHaveBeenCalledWith("/tasks");
  });
});

describe("createTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a task successfully", async () => {
    mockSafeParse.mockReturnValue({
      success: true,
      data: {
        name: "Tarefa 1",
      },
    });

    mockInsert.mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([
          {
            id: 1,
            name: "Tarefa 1",
          },
        ]),
      }),
    });

    const formData = new FormData();

    formData.set("name", "Tarefa 1");

    const result = await createTask(
      {
        success: false,
        message: "",
      },
      formData,
    );

    expect(result).toEqual({
      success: true,
      message: "Tarefa Tarefa 1 criada com sucesso.",
    });
  });

  it("returns validation error", async () => {
    mockSafeParse.mockReturnValue({
      success: false,
      error: {
        issues: [
          {
            message: "Nome obrigatório",
          },
        ],
      },
    });

    const result = await createTask(
      {
        success: false,
        message: "",
      },
      new FormData(),
    );

    expect(result).toEqual({
      success: false,
      message: "Nome obrigatório",
    });
  });

  it("returns default validation error message", async () => {
    mockSafeParse.mockReturnValue({
      success: false,
      error: {
        issues: [],
      },
    });

    const result = await createTask(
      {
        success: false,
        message: "",
      },
      new FormData(),
    );

    expect(result).toEqual({
      success: false,
      message: "Dados inválidos.",
    });
  });

  it("returns error when insert does not return a task", async () => {
    mockSafeParse.mockReturnValue({
      success: true,
      data: {
        name: "Tarefa 1",
      },
    });

    mockInsert.mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([]),
      }),
    });

    const result = await createTask(
      {
        success: false,
        message: "",
      },
      new FormData(),
    );

    expect(result).toEqual({
      success: false,
      message: "Erro ao criar tarefa.",
    });
  });
});
