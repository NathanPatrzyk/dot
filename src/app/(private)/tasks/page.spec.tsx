import { render, screen } from "@testing-library/react";
import {
  getAllTasks,
  getPendingTasks,
  getCompletedTasks,
} from "@/queries/tasks";
import { requireSession } from "@/lib/require-session";
import Tasks from "./page";

jest.mock("@/lib/require-session", () => ({
  requireSession: jest.fn(),
}));

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

jest.mock("@/components/logout-button", () => ({
  LogoutButton: () => <div>LogoutButton</div>,
}));

const mockRequireSession = requireSession as jest.Mock;
const mockGetAllTasks = getAllTasks as jest.Mock;
const mockGetPendingTasks = getPendingTasks as jest.Mock;
const mockGetCompletedTasks = getCompletedTasks as jest.Mock;

describe("Tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireSession.mockResolvedValue({
      user: { id: "user-1", name: "Nathan" },
    });
  });

  it("renders the welcome message, title, weather widget, form and progress", async () => {
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

    expect(screen.getByText("Bem-vindo, Nathan")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "dot • Tarefas",
    );
    expect(screen.getByText("WeatherWidget")).toBeInTheDocument();
    expect(screen.getByText("TaskForm")).toBeInTheDocument();
    expect(screen.getByText("LogoutButton")).toBeInTheDocument();
    expect(screen.getByText("0/0")).toBeInTheDocument();
  });

  it("fetches tasks scoped to the current user", async () => {
    mockGetAllTasks.mockResolvedValue({
      allTasks: [],
      porcentage: 0,
      completed: 0,
      total: 0,
    });
    mockGetPendingTasks.mockResolvedValue({ pendingTasks: [] });
    mockGetCompletedTasks.mockResolvedValue({ completedTasks: [] });

    await Tasks();

    expect(mockGetAllTasks).toHaveBeenCalledWith("user-1");
    expect(mockGetPendingTasks).toHaveBeenCalledWith("user-1");
    expect(mockGetCompletedTasks).toHaveBeenCalledWith("user-1");
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
