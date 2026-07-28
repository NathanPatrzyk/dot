import { render, screen } from "@testing-library/react";
import {
  getAllTasks,
  getPendingTasks,
  getCompletedTasks,
} from "@/queries/tasks";
import Tasks from "./page";

jest.mock("@/queries/tasks", () => ({
  getAllTasks: jest.fn(),
  getPendingTasks: jest.fn(),
  getCompletedTasks: jest.fn(),
}));

jest.mock("@/components/task-list", () => ({
  TaskList: ({ tasks }: { tasks: { name: string }[] }) => (
    <div>{tasks.map((task) => task.name).join(", ")}</div>
  ),
}));

jest.mock("@/components/task-form", () => ({
  TaskForm: () => <div>TaskForm</div>,
}));

jest.mock("@/components/weather-widget", () => ({
  __esModule: true,
  default: () => <div>WeatherWidget</div>,
}));

const mockGetAllTasks = getAllTasks as jest.Mock;
const mockGetPendingTasks = getPendingTasks as jest.Mock;
const mockGetCompletedTasks = getCompletedTasks as jest.Mock;

describe("Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title, weather widget, form and progress", async () => {
    mockGetAllTasks.mockResolvedValue({
      allTasks: [],
      porcentage: 0,
      completed: 0,
      total: 0,
    });
    mockGetPendingTasks.mockResolvedValue({ pendingTasks: [] });
    mockGetCompletedTasks.mockResolvedValue({ completedTasks: [] });

    const jsx = await Tasks();
    render(jsx);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "dot • Tarefas",
    );
    expect(screen.getByText("WeatherWidget")).toBeInTheDocument();
    expect(screen.getByText("TaskForm")).toBeInTheDocument();
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("renders tabs for all, pending and completed tasks", async () => {
    mockGetAllTasks.mockResolvedValue({
      allTasks: [{ id: 1, name: "Tarefa 1", isCompleted: false }],
      porcentage: 0,
      completed: 0,
      total: 1,
    });
    mockGetPendingTasks.mockResolvedValue({
      pendingTasks: [{ id: 1, name: "Tarefa 1", isCompleted: false }],
    });
    mockGetCompletedTasks.mockResolvedValue({
      completedTasks: [{ id: 2, name: "Tarefa 2", isCompleted: true }],
    });

    const jsx = await Tasks();
    render(jsx);

    expect(screen.getByRole("tab", { name: /Todas/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Pendentes/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Concluídas/ })).toBeInTheDocument();
  });
});
