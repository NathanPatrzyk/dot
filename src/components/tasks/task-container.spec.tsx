import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

import { TaskContainer } from "./task-container";
import { createTask, deleteTask, toggleTask } from "@/actions/tasks";
import { createTasks } from "@/types/tasks.mock";

describe("TaskContainer", () => {
  beforeEach(() => {
    vi.mocked(createTask).mockResolvedValue({
      success: true,
      message: "Tarefa criada com sucesso.",
    });
    vi.mocked(toggleTask).mockResolvedValue(undefined);
    vi.mocked(deleteTask).mockResolvedValue(undefined);
  });

  it("should keep the list unchanged while the creation is pending", async () => {
    vi.mocked(createTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<TaskContainer tasks={[]} categoryId={null} />);

    fireEvent.change(screen.getByPlaceholderText("Nova tarefa"), {
      target: { value: "my-fantastic-task" },
    });
    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "" }),
      expect.any(FormData),
    );
    expect(screen.queryByText("my-fantastic-task")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar/i })).toBeDisabled();
    expect(screen.getByPlaceholderText("Nova tarefa")).toBeDisabled();
  });

  it("should keep the task unchecked while the toggle is pending", async () => {
    vi.mocked(toggleTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<TaskContainer tasks={createTasks()} categoryId={null} />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(toggleTask).toHaveBeenCalledWith(1);
    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
  });

  it("should filter the tasks by tab", async () => {
    const user = userEvent.setup();
    render(<TaskContainer tasks={createTasks()} categoryId={null} />);

    expect(screen.getByText("write-the-tests")).toBeInTheDocument();
    expect(screen.getByText("refactor-deletion-service")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /pendentes/i }));

    expect(screen.getByText("write-the-tests")).toBeInTheDocument();
    expect(
      screen.queryByText("refactor-deletion-service"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /concluídas/i }));

    expect(screen.queryByText("write-the-tests")).not.toBeInTheDocument();
    expect(screen.getByText("refactor-deletion-service")).toBeInTheDocument();
  });

  it("should keep the task in the list while the deletion is pending", async () => {
    vi.mocked(deleteTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<TaskContainer tasks={createTasks()} categoryId={null} />);

    await user.click(screen.getAllByRole("button")[1]);

    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(screen.getByText("write-the-tests")).toBeInTheDocument();
    expect(screen.getByText("refactor-deletion-service")).toBeInTheDocument();
  });

  it("should not add a task when the name is blank", async () => {
    const user = userEvent.setup();
    render(<TaskContainer tasks={[]} categoryId={null} />);

    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(createTask).not.toHaveBeenCalled();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
