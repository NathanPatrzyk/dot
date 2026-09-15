import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/actions/tasks", () => ({
  createTask: vi.fn(),
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

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

  it("should optimistically add the task on submit", async () => {
    vi.mocked(createTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    const { container } = render(<TaskContainer tasks={[]} />);

    fireEvent.change(screen.getByPlaceholderText("Nova tarefa"), {
      target: { value: "my-fantastic-task" },
    });
    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(await screen.findByText("my-fantastic-task")).toBeInTheDocument();

    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "" }),
      expect.any(FormData),
    );
    expect(container.querySelectorAll('[class*="rounded-full"]')).toHaveLength(
      1,
    );
  });

  it("should optimistically toggle a task when checked", async () => {
    vi.mocked(toggleTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    const { container } = render(<TaskContainer tasks={createTasks()} />);

    expect(screen.getByText("write-the-tests")).toBeInTheDocument();
    expect(
      container.querySelectorAll('[class*="rounded-full"][class*="bg-input"]'),
    ).toHaveLength(1);

    await user.click(screen.getAllByRole("checkbox")[0]);

    await waitFor(() =>
      expect(screen.getAllByRole("checkbox")[0]).toBeChecked(),
    );

    expect(toggleTask).toHaveBeenCalledWith(1);
    expect(
      container.querySelectorAll('[class*="rounded-full"][class*="bg-input"]'),
    ).toHaveLength(0);
  });

  it("should filter the tasks by tab", async () => {
    const user = userEvent.setup();
    render(<TaskContainer tasks={createTasks()} />);

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

  it("should optimistically remove a task when deleted", async () => {
    vi.mocked(deleteTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<TaskContainer tasks={createTasks()} />);

    await user.click(screen.getAllByRole("button")[1]);

    await waitFor(() =>
      expect(screen.queryByText("write-the-tests")).not.toBeInTheDocument(),
    );

    expect(deleteTask).toHaveBeenCalledWith(1);
    expect(screen.getByText("refactor-deletion-service")).toBeInTheDocument();
  });

  it("should not add a task when the name is blank", async () => {
    const user = userEvent.setup();
    render(<TaskContainer tasks={[]} />);

    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(createTask).not.toHaveBeenCalled();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
