vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("@/queries/tasks", () => ({ getTasks: vi.fn() }));
vi.mock("@/components/shared/logout-button", () => ({
  LogoutButton: () => <button>Sair</button>,
}));
vi.mock("@/components/shared/request-user-deletion-dialog", () => ({
  RequestUserDeletionDialog: () => <div data-testid="request-deletion" />,
}));
vi.mock("@/components/shared/weather-widget", () => ({
  default: () => <div data-testid="weather-widget" />,
}));
vi.mock("@/components/tasks/task-container", () => ({
  TaskContainer: ({ tasks }: { tasks: unknown[] }) => (
    <div data-testid="task-container">{tasks.length}</div>
  ),
}));

import { render, screen } from "@testing-library/react";
import Tasks from "@/app/(private)/tasks/page";
import { requireSession } from "@/lib/require-session";
import { getTasks } from "@/queries/tasks";

describe("Tasks page", () => {
  beforeEach(() => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("OPENWEATHER_ENABLED", "false");
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe", name: "John Doe" },
    } as never);
    vi.mocked(getTasks).mockResolvedValue([
      { id: "t1", title: "Wash the dishes", done: false },
    ] as never);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("should render the welcome and the tasks", async () => {
    render(await Tasks());

    expect(screen.getByText(/bem-vindo, john doe/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /dot • tarefas/i,
    );
    expect(screen.getByTestId("task-container")).toHaveTextContent("1");
    expect(getTasks).toHaveBeenCalledWith("john-doe");
  });

  it("should show the deletion button when it is not a homelab", async () => {
    render(await Tasks());

    expect(screen.getByTestId("request-deletion")).toBeInTheDocument();
  });

  it("should hide the deletion button when it is a homelab", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://homelab/db");

    render(await Tasks());

    expect(screen.queryByTestId("request-deletion")).not.toBeInTheDocument();
  });

  it("should hide the weather widget when openweather is disabled", async () => {
    render(await Tasks());

    expect(screen.queryByTestId("weather-widget")).not.toBeInTheDocument();
  });

  it("should show the weather widget when openweather is enabled", async () => {
    vi.stubEnv("OPENWEATHER_ENABLED", "true");

    render(await Tasks());

    expect(screen.getByTestId("weather-widget")).toBeInTheDocument();
  });
});
