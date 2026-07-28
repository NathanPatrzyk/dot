import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { deleteTask, toggleTask } from "@/actions/tasks";
import { toast } from "sonner";
import { TaskItem } from "./task-item";

jest.mock("@/actions/tasks", () => ({
  toggleTask: jest.fn(),
  deleteTask: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockToggleTask = toggleTask as jest.Mock;
const mockDeleteTask = deleteTask as jest.Mock;

describe("TaskItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the task name unchecked", () => {
    render(<TaskItem id={1} name="Tarefa 1" isCompleted={false} />);

    expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("renders the task name checked with strikethrough", () => {
    render(<TaskItem id={1} name="Tarefa 1" isCompleted={true} />);

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("marks as completed optimistically and calls toggleTask", async () => {
    const user = userEvent.setup();
    let resolveToggle: () => void;
    mockToggleTask.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveToggle = resolve;
        }),
    );

    render(<TaskItem id={1} name="Tarefa 1" isCompleted={false} />);

    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(screen.getByRole("checkbox")).toBeChecked();
    });
    expect(mockToggleTask).toHaveBeenCalledWith(1);

    resolveToggle!();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Tarefa 1 concluída.");
    });
  });

  it("shows an error toast when toggleTask fails", async () => {
    const user = userEvent.setup();
    mockToggleTask.mockRejectedValue(new Error("fail"));

    render(<TaskItem id={1} name="Tarefa 1" isCompleted={false} />);

    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível atualizar a tarefa.",
      );
    });
  });

  it("marks as reopened when unchecking a completed task", async () => {
    const user = userEvent.setup();
    let resolveToggle: () => void;
    mockToggleTask.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveToggle = resolve;
        }),
    );

    render(<TaskItem id={1} name="Tarefa 1" isCompleted={true} />);

    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    resolveToggle!();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Tarefa 1 reaberta.");
    });
  });

  it("deletes the task and calls onDelete optimistically", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    let resolveDelete: () => void;
    mockDeleteTask.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveDelete = resolve;
        }),
    );

    render(
      <TaskItem
        id={1}
        name="Tarefa 1"
        isCompleted={false}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(onDelete).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith(1);
    });

    resolveDelete!();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Tarefa 1 excluída.");
    });
  });

  it("shows an error toast when deleteTask fails", async () => {
    const user = userEvent.setup();
    mockDeleteTask.mockRejectedValue(new Error("fail"));

    render(<TaskItem id={1} name="Tarefa 1" isCompleted={false} />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível excluir a tarefa.",
      );
    });
  });
});
