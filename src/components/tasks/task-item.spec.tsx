import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "./task-item";

describe("TaskItem", () => {
  it("should render the task name and toggle when checked", async () => {
    const onToggle = vi.fn();
    render(
      <TaskItem
        id={1}
        name="write-the-tests"
        isCompleted={false}
        onToggle={onToggle}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("write-the-tests")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox"));

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("should mark the completed task name with the line-through style", () => {
    render(
      <TaskItem
        id={2}
        name="refactor-deletion-service"
        isCompleted={true}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("refactor-deletion-service")).toHaveClass(
      "line-through",
    );
  });

  it("should call onDelete when the delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskItem
        id={2}
        name="write-the-tests"
        isCompleted={false}
        onToggle={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button"));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
