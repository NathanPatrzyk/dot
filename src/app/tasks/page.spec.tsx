import { render, screen } from "@testing-library/react";
import { getTasks } from "@/queries/tasks";
import Tasks from "./page";

jest.mock("@/queries/tasks", () => ({
  getTasks: jest.fn(),
}));

jest.mock("@/components/task-item", () => ({
  TaskItem: ({ name }: { name: string }) => <div>{name}</div>,
}));

jest.mock("@/components/task-form", () => ({
  TaskForm: () => <div>TaskForm</div>,
}));

jest.mock("@/components/weather-widget", () => ({
  __esModule: true,
  default: () => <div>WeatherWidget</div>,
}));

const mockGetTasks = getTasks as jest.Mock;

describe("Tasks", () => {
  it("renders the title, weather widget, form and progress", async () => {
    mockGetTasks.mockResolvedValue({
      tasks: [],
      porcentage: 0,
      completed: 0,
      total: 0,
    });

    const jsx = await Tasks();
    render(jsx);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "dot • Tarefas",
    );
    expect(screen.getByText("WeatherWidget")).toBeInTheDocument();
    expect(screen.getByText("TaskForm")).toBeInTheDocument();
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("renders one item per task when lat/lon are present", async () => {
    mockGetTasks.mockResolvedValue({
      tasks: [
        { id: "1", name: "Tarefa 1", isCompleted: false },
        { id: "2", name: "Tarefa 2", isCompleted: true },
      ],
      porcentage: 50,
      completed: 1,
      total: 2,
    });

    const jsx = await Tasks();
    render(jsx);

    expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
    expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
