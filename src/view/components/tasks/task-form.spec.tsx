import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskForm } from "@/view/components/tasks/task-form";

describe("TaskForm", () => {
  it("should submit the form data and reset the input", async () => {
    const action = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();
    render(<TaskForm action={action} />);

    const input = screen.getByPlaceholderText("Nova tarefa");
    await user.type(input, "my-fantastic-task");
    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(action).toHaveBeenCalledTimes(1);

    const [formData] = action.mock.calls[0] as [FormData];
    expect(formData.get("name")).toBe("my-fantastic-task");
    expect(input).toHaveValue("");
  });

  it("should not reset the input when the action fails", async () => {
    const action = vi.fn().mockResolvedValue(false);
    const user = userEvent.setup();
    render(<TaskForm action={action} />);

    const input = screen.getByPlaceholderText("Nova tarefa");
    await user.type(input, "my-fantastic-task");
    await user.click(screen.getByRole("button", { name: /criar/i }));

    expect(action).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("my-fantastic-task");
  });
});
