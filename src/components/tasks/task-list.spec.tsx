import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "./task-list";
import { createTasks } from "@/types/tasks.mock";

describe("TaskList", () => {
  it("should render one item per task", () => {
    render(
      <TaskList tasks={createTasks()} onToggle={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText("write-the-tests")).toBeInTheDocument();
    expect(screen.getByText("refactor-deletion-service")).toBeInTheDocument();
  });

  it("should toggle the first task with its name and state", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskList tasks={createTasks()} onToggle={onToggle} onDelete={vi.fn()} />,
    );

    await user.click(screen.getAllByRole("checkbox")[0]);

    expect(onToggle).toHaveBeenCalledWith(1, "write-the-tests", true);
  });

  it("should delete the first task with its name", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <TaskList tasks={createTasks()} onToggle={vi.fn()} onDelete={onDelete} />,
    );

    await user.click(screen.getAllByRole("button")[0]);

    expect(onDelete).toHaveBeenCalledWith(1, "write-the-tests");
  });
});
