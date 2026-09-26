import { act, fireEvent, render, screen } from "@testing-library/react";
import { TaskForm } from "@/components/tasks/task-form";

describe("TaskForm", () => {
  it("should submit the form data and reset the input", async () => {
    const action = vi.fn().mockResolvedValue(true);
    render(<TaskForm action={action} />);

    fireEvent.change(screen.getByPlaceholderText("Nova tarefa"), {
      target: { value: "my-fantastic-task" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /criar/i }));
    });

    expect(action).toHaveBeenCalledTimes(1);

    const [formData] = action.mock.calls[0] as [FormData];
    expect(formData.get("name")).toBe("my-fantastic-task");
    expect(screen.getByPlaceholderText("Nova tarefa")).toHaveValue("");
  });
});

it("should not reset the input when the action fails", async () => {
  const action = vi.fn().mockResolvedValue(false);
  render(<TaskForm action={action} />);

  fireEvent.change(screen.getByPlaceholderText("Nova tarefa"), {
    target: { value: "my-fantastic-task" },
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /criar/i }));
  });

  expect(action).toHaveBeenCalledTimes(1);
  expect(screen.getByPlaceholderText("Nova tarefa")).toHaveValue(
    "my-fantastic-task",
  );
});
