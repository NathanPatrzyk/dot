import { render, screen } from "@testing-library/react";
import { getTasks } from "@/queries/tasks";
import { getCurrentWeather } from "@/services/weather-service";
import Tasks from "./page";

jest.mock("@/queries/tasks", () => ({
  getTasks: jest.fn(),
}));

jest.mock("@/services/weather-service", () => ({
  getCurrentWeather: jest.fn(),
}));

jest.mock("@/components/task-item", () => ({
  TaskItem: ({ name }: { name: string }) => <div>{name}</div>,
}));

jest.mock("@/components/task-form", () => ({
  TaskForm: () => <div>TaskForm</div>,
}));

jest.mock("@/components/weather-widget", () => ({
  __esModule: true,
  default: ({ data }: { data: { city: string } }) => <div>{data.city}</div>,
}));

jest.mock("@/components/geolocation-capture", () => ({
  __esModule: true,
  default: () => <div>GeolocationCapture</div>,
}));

const mockGetTasks = getTasks as jest.Mock;
const mockGetCurrentWeather = getCurrentWeather as jest.Mock;

describe("Tasks", () => {
  it("renders GeolocationCapture when lat/lon are missing", async () => {
    mockGetTasks.mockResolvedValue({
      tasks: [],
      porcentage: 0,
      completed: 0,
      total: 0,
    });

    const jsx = await Tasks({ searchParams: Promise.resolve({}) });
    render(jsx);

    expect(screen.getByText("GeolocationCapture")).toBeInTheDocument();
    expect(mockGetCurrentWeather).not.toHaveBeenCalled();
  });

  it("renders the title, form, progress and weather when lat/lon are present", async () => {
    mockGetTasks.mockResolvedValue({
      tasks: [],
      porcentage: 0,
      completed: 0,
      total: 0,
    });
    mockGetCurrentWeather.mockResolvedValue({
      temperature: 25,
      code: 800,
      city: "São Paulo",
    });

    const jsx = await Tasks({
      searchParams: Promise.resolve({ lat: "-23.55", lon: "-46.63" }),
    });
    render(jsx);

    expect(mockGetCurrentWeather).toHaveBeenCalledWith(-23.55, -46.63);
    expect(screen.getByText("São Paulo")).toBeInTheDocument();
    expect(screen.getByText("Tarefas")).toBeInTheDocument();
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
    mockGetCurrentWeather.mockResolvedValue({
      temperature: 25,
      code: 800,
      city: "São Paulo",
    });

    const jsx = await Tasks({
      searchParams: Promise.resolve({ lat: "-23.55", lon: "-46.63" }),
    });
    render(jsx);

    expect(screen.getByText("Tarefa 1")).toBeInTheDocument();
    expect(screen.getByText("Tarefa 2")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
