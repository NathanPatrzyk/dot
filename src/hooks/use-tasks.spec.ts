import { act, renderHook, waitFor } from "@testing-library/react";

vi.mock("@/actions/tasks", () => ({
  createTask: vi.fn(),
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(() => "toast-id"),
  },
}));

import { useTasks } from "@/hooks/use-tasks";
import { createTask, toggleTask, deleteTask } from "@/actions/tasks";
import { toast } from "sonner";
import { createTasks } from "@/types/tasks.mock";

describe("useTasks", () => {
  beforeEach(() => {
    vi.mocked(createTask).mockResolvedValue({
      success: true,
      message: "Tarefa my-fantastic-task criada com sucesso.",
    });
    vi.mocked(toggleTask).mockResolvedValue(undefined);
    vi.mocked(deleteTask).mockResolvedValue(undefined);
  });

  it("should derive pending and completed lists and totals", () => {
    const { result } = renderHook(() => useTasks(createTasks()));

    expect(result.current.allTasks).toHaveLength(2);
    expect(result.current.pending).toBe(1);
    expect(result.current.completed).toBe(1);
    expect(result.current.pendingTasks.map((task) => task.id)).toEqual([1]);
    expect(result.current.completedTasks.map((task) => task.id)).toEqual([2]);
  });

  it("should return zero totals when there are no tasks", () => {
    const { result } = renderHook(() => useTasks([]));

    expect(result.current.pending).toBe(0);
    expect(result.current.completed).toBe(0);
    expect(result.current.pendingTasks).toEqual([]);
    expect(result.current.completedTasks).toEqual([]);
  });

  it("should not create a task when the name is blank", () => {
    const { result } = renderHook(() => useTasks([]));
    const formData = new FormData();
    formData.set("name", "   ");

    act(() => {
      result.current.handleCreate(formData);
    });

    expect(result.current.allTasks).toHaveLength(0);
    expect(createTask).not.toHaveBeenCalled();
  });

  it("should keep the list unchanged while the creation is pending", async () => {
    vi.mocked(createTask).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useTasks([]));
    const formData = new FormData();
    formData.set("name", "my-fantastic-task");

    act(() => {
      result.current.handleCreate(formData);
    });

    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "" }),
      formData,
    );
    expect(result.current.allTasks).toHaveLength(0);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should toast the success message when the creation succeeds", async () => {
    const { result } = renderHook(() => useTasks([]));
    const formData = new FormData();
    formData.set("name", "my-fantastic-task");

    await act(async () => {
      result.current.handleCreate(formData);
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Tarefa my-fantastic-task criada com sucesso.",
      ),
    );
  });

  it("should toast an error message when the creation fails", async () => {
    vi.mocked(createTask).mockResolvedValue({
      success: false,
      message: "O nome é obrigatório.",
    });
    const { result } = renderHook(() => useTasks([]));
    const formData = new FormData();
    formData.set("name", "my-fantastic-task");

    await act(async () => {
      result.current.handleCreate(formData);
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("O nome é obrigatório."),
    );
  });

  it("should keep the task open while the toggle is pending", async () => {
    vi.mocked(toggleTask).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useTasks(createTasks()));

    act(() => {
      result.current.handleToggle(1, "write-the-tests", true);
    });

    expect(toggleTask).toHaveBeenCalledWith(1);
    expect(result.current.allTasks[0].isCompleted).toBe(false);
    expect(result.current.loadingToggleId).toBe(1);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should toast the completion message when the toggle succeeds", async () => {
    const { result } = renderHook(() => useTasks(createTasks()));

    await act(async () => {
      result.current.handleToggle(1, "write-the-tests", true);
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("write-the-tests concluída.", {
        id: "toast-id",
      }),
    );
    expect(toggleTask).toHaveBeenCalledWith(1);
  });

  it("should toast the reopen message when a completed task is toggled back", async () => {
    const { result } = renderHook(() => useTasks(createTasks()));

    await act(async () => {
      result.current.handleToggle(2, "refactor-deletion-service", false);
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "refactor-deletion-service reaberta.",
        { id: "toast-id" },
      ),
    );
    expect(toggleTask).toHaveBeenCalledWith(2);
  });

  it("should toast an error when toggling fails", async () => {
    vi.mocked(toggleTask).mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useTasks(createTasks()));

    await act(async () => {
      result.current.handleToggle(1, "write-the-tests", true);
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível atualizar tarefa.",
        { id: "toast-id" },
      ),
    );
  });

  it("should keep the task in the list while the deletion is pending", async () => {
    vi.mocked(deleteTask).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useTasks(createTasks()));

    act(() => {
      result.current.handleDelete(1, "write-the-tests");
    });

    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(result.current.allTasks).toHaveLength(2);
    expect(result.current.loadingDeleteId).toBe(1);
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should toast the deletion message when the deletion succeeds", async () => {
    const { result } = renderHook(() => useTasks(createTasks()));

    await act(async () => {
      result.current.handleDelete(1, "write-the-tests");
    });

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("write-the-tests excluída.", {
        id: "toast-id",
      }),
    );
    expect(deleteTask).toHaveBeenCalledWith(1);
  });

  it("should toast an error when deleting fails", async () => {
    vi.mocked(deleteTask).mockRejectedValue(new Error("network"));
    const { result } = renderHook(() => useTasks(createTasks()));

    await act(async () => {
      result.current.handleDelete(1, "write-the-tests");
    });

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível excluir tarefa.",
        { id: "toast-id" },
      ),
    );
  });
});
