import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createTask } from "@/actions/tasks";
import { toast } from "sonner";
import { TaskForm } from "./task-form";

jest.mock("@/actions/tasks", () => ({
  createTask: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockCreateTask = createTask as jest.Mock;

describe("TaskForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input and submit button", () => {
    render(<TaskForm />);

    expect(screen.getByPlaceholderText("Nova tarefa")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows a success toast when the action succeeds", async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValue({
      success: true,
      message: "Tarefa criada.",
    });

    render(<TaskForm />);

    await user.type(screen.getByPlaceholderText("Nova tarefa"), "Tarefa 1");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Tarefa criada.");
    });
  });

  it("shows an error toast when the action fails", async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValue({
      success: false,
      message: "Nome é obrigatório.",
    });

    render(<TaskForm />);

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Nome é obrigatório.");
    });
  });

  it("shows the spinner while pending", async () => {
    const user = userEvent.setup();
    let resolveAction: (value: { success: boolean; message: string }) => void;
    mockCreateTask.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<TaskForm />);

    await user.click(screen.getByRole("button"));

    expect(document.querySelector("svg")).toBeInTheDocument();

    resolveAction!({ success: true, message: "Tarefa criada." });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
