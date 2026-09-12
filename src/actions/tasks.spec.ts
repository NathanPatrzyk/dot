import { createMockedTasksRepository } from "@/adapters/shared/tasks.repository.mock";
import type { TaskRecord } from "@/core/ports/tasks.repository";

vi.mock("@/adapters", () => ({ getTasksRepository: vi.fn() }));
vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { toggleTask, deleteTask, createTask } from "./tasks";
import { getTasksRepository } from "@/adapters";
import { requireSession } from "@/lib/require-session";
import { revalidatePath } from "next/cache";

describe("tasks actions", () => {
  beforeEach(() => {
    vi.mocked(getTasksRepository).mockReturnValue(
      createMockedTasksRepository(),
    );
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as Awaited<ReturnType<typeof requireSession>>);
  });

  describe("toggleTask", () => {
    it("should throw when the id is falsy", async () => {
      await expect(toggleTask(0)).rejects.toThrow("Id inválido.");

      expect(requireSession).toHaveBeenCalledTimes(1);
      expect(getTasksRepository).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should throw when the id is not a number", async () => {
      await expect(toggleTask("12" as unknown as number)).rejects.toThrow(
        "Id inválido.",
      );
    });

    it("should toggle the task and revalidate the tasks path", async () => {
      const repository = createMockedTasksRepository({
        findById: vi.fn(async () => ({
          id: 12,
          name: "my-fantastic-task",
          isCompleted: false,
        })),
      });
      vi.mocked(getTasksRepository).mockReturnValue(repository);

      await toggleTask(12);

      expect(repository.update).toHaveBeenCalledWith(12, "john-doe", {
        isCompleted: true,
      });
      expect(revalidatePath).toHaveBeenCalledWith("/tasks");
    });

    it("should propagate an error when the task does not exist", async () => {
      await expect(toggleTask(404)).rejects.toThrow("Tarefa não encontrada.");

      expect(getTasksRepository).toHaveBeenCalledTimes(1);
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("should throw when the id is invalid", async () => {
      await expect(deleteTask(0)).rejects.toThrow("Id inválido.");

      expect(getTasksRepository).not.toHaveBeenCalled();
    });

    it("should delete the task and revalidate the tasks path", async () => {
      const repository = createMockedTasksRepository();
      vi.mocked(getTasksRepository).mockReturnValue(repository);

      await deleteTask(12);

      expect(repository.update).toHaveBeenCalledWith(12, "john-doe", {
        deletedAt: expect.any(Date),
      });
      expect(revalidatePath).toHaveBeenCalledWith("/tasks");
    });
  });

  describe("createTask", () => {
    it("should return invalid when the payload is not a FormData", async () => {
      const result = await createTask(
        { success: false, message: "" },
        {} as unknown as FormData,
      );

      expect(result).toEqual({ success: false, message: "Dados inválidos." });
      expect(getTasksRepository).not.toHaveBeenCalled();
    });

    it("should return the schema error when the name is empty", async () => {
      const formData = new FormData();
      formData.set("name", "");

      const result = await createTask(
        { success: false, message: "" },
        formData,
      );

      expect(result).toEqual({
        success: false,
        message: "O nome é obrigatório.",
      });
      expect(getTasksRepository).not.toHaveBeenCalled();
    });

    it("should return an error when the repository fails to create the task", async () => {
      const repository = createMockedTasksRepository({
        create: vi.fn(
          async (): Promise<TaskRecord> => null as unknown as TaskRecord,
        ),
      });
      vi.mocked(getTasksRepository).mockReturnValue(repository);
      const formData = new FormData();
      formData.set("name", "my-fantastic-task");

      const result = await createTask(
        { success: false, message: "" },
        formData,
      );

      expect(result).toEqual({
        success: false,
        message: "Erro ao criar tarefa.",
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should create the task and revalidate the tasks path", async () => {
      const repository = createMockedTasksRepository();
      vi.mocked(getTasksRepository).mockReturnValue(repository);
      const formData = new FormData();
      formData.set("name", "my-fantastic-task");

      const result = await createTask(
        { success: false, message: "" },
        formData,
      );

      expect(result).toEqual({
        success: true,
        message: "Tarefa my-fantastic-task criada com sucesso.",
      });
      expect(repository.create).toHaveBeenCalledWith(
        { name: "my-fantastic-task" },
        "john-doe",
      );
      expect(revalidatePath).toHaveBeenCalledWith("/tasks");
    });
  });
});
