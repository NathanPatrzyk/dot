import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { startTransition } from "react";
import { Task } from "@/types/tasks";
import { TaskList } from "./task-list";

jest.mock("./task-item", () => ({
  TaskItem: ({ name, onDelete }: { name: string; onDelete?: () => void }) => (
    <div>
      <span>{name}</span>
      <button
        onClick={() => {
          startTransition(async () => {
            onDelete?.();
            await new Promise(() => {});
          });
        }}
      >
        excluir {name}
      </button>
    </div>
  ),
}));

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 1,
    name: "Tarefa",
    isCompleted: false,
    createdAt: new Date("2026-01-01"),
    deletedAt: null,
    userId: "user-1",
    ...overrides,
  };
}

describe("TaskList", () => {
  it("renders one item per task", () => {
    render(
      <TaskList
        tasks={[
          makeTask({ id: 1, name: "Tarefa 1" }),
          makeTask({ id: 2, name: "Tarefa 2", isCompleted: true }),
        ]}
      />,
    );

    expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
    expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
  });

  it("renders nothing when there are no tasks", () => {
    const { container } = render(<TaskList tasks={[]} />);

    expect(container.querySelector("div")).toBeEmptyDOMElement();
  });

  it("removes a task optimistically when onDelete is triggered", async () => {
    const user = userEvent.setup();

    render(
      <TaskList
        tasks={[
          makeTask({ id: 1, name: "Tarefa 1" }),
          makeTask({ id: 2, name: "Tarefa 2" }),
        ]}
      />,
    );

    await user.click(screen.getByText("excluir Tarefa 1"));

    await waitFor(() => {
      expect(screen.queryByText("Tarefa 1")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
  });
});
