import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/actions/tasks", () => ({
  createTask: vi.fn(),
  toggleTask: vi.fn(),
  deleteTask: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { TaskContainer } from "./task-container";
import { createTask, toggleTask } from "@/actions/tasks";
import { createTasks } from "@/types/tasks.mock";

describe("TaskContainer", () => {
  beforeEach(() => {
    vi.mocked(createTask).mockResolvedValue({
      success: true,
      message: "Tarefa my-fantastic-task criada com sucesso.",
    });
    vi.mocked(toggleTask).mockResolvedValue(undefined);
  });

  it("should render the progress summary", () => {
    render(<TaskContainer tasks={createTasks()} />);

    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("should optimistically add the task on submit", async () => {
    vi.mocked(createTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<TaskContainer tasks={[]} />);

    fireEvent.change(screen.getByPlaceholderText("Nova tarefa"), {
      target: { value: "my-fantastic-task" },
    });
    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(await screen.findByText("my-fantastic-task")).toBeInTheDocument();
    expect(createTask).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "" }),
      expect.any(FormData),
    );
  });

  it("should optimistically toggle a task when checked", async () => {
    vi.mocked(toggleTask).mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<TaskContainer tasks={createTasks()} />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    await waitFor(() =>
      expect(screen.getAllByRole("checkbox")[0]).toBeChecked(),
    );
  });

  it("should not add a task when the name is blank", async () => {
    const user = userEvent.setup();
    render(<TaskContainer tasks={[]} />);

    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(createTask).not.toHaveBeenCalled();
    expect(screen.queryByText("my-fantastic-task")).not.toBeInTheDocument();
  });
});
