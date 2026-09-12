import { fireEvent, render, screen } from "@testing-library/react";
import { TaskForm } from "@/components/tasks/task-form";

describe("TaskForm", () => {
  it("should submit the form data and reset the input", () => {
    const action = vi.fn();
    render(<TaskForm action={action} />);

    fireEvent.change(screen.getByPlaceholderText("Nova tarefa"), {
      target: { value: "my-fantastic-task" },
    });
    fireEvent.click(screen.getByRole("button", { name: /criar/i }));

    expect(action).toHaveBeenCalledTimes(1);

    const [formData] = action.mock.calls[0] as [FormData];
    expect(formData.get("name")).toBe("my-fantastic-task");
    expect(screen.getByPlaceholderText("Nova tarefa")).toHaveValue("");
  });
});
