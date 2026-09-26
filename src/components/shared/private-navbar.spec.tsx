vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("./logout-button", () => ({
  LogoutButton: () => <button>Sair</button>,
}));
vi.mock("./request-user-deletion-dialog", () => ({
  RequestUserDeletionDialog: () => <div>delete-dialog</div>,
}));
vi.mock("./weather-widget", () => ({
  WeatherWidget: () => <div>weather</div>,
}));

import { render, screen } from "@testing-library/react";
import { PrivateNavbar } from "./private-navbar";
import { requireSession } from "@/lib/require-session";

describe("PrivateNavbar", () => {
  beforeEach(() => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe", name: "John Doe" },
    } as never);
    vi.stubEnv("DATABASE_URL", undefined);
    vi.stubEnv("OPENWEATHER_ENABLED", undefined);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("should greet the user and render the title", async () => {
    render(await PrivateNavbar({ title: "Casa" }));

    expect(screen.getByText("Bem-vindo, John Doe")).toBeInTheDocument();
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("dot");
    expect(heading).toHaveTextContent("Casa");
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });

  it("should show the deletion dialog when not self-hosted", async () => {
    render(await PrivateNavbar({ title: "Casa" }));

    expect(screen.getByText("delete-dialog")).toBeInTheDocument();
  });

  it("should hide the deletion dialog when self-hosted", async () => {
    vi.stubEnv("DATABASE_URL", "postgres://localhost/db");

    render(await PrivateNavbar({ title: "Casa" }));

    expect(screen.queryByText("delete-dialog")).not.toBeInTheDocument();
  });

  it("should render the weather widget when enabled", async () => {
    vi.stubEnv("OPENWEATHER_ENABLED", "true");

    render(await PrivateNavbar({ title: "Casa" }));

    expect(screen.getByText("weather")).toBeInTheDocument();
  });

  it("should not render the weather widget when disabled", async () => {
    render(await PrivateNavbar({ title: "Casa" }));

    expect(screen.queryByText("weather")).not.toBeInTheDocument();
  });
});
