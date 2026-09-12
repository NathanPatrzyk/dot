vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("@/components/shared/reactivate-user-button", () => ({
  ReactivateUserButton: () => <button>Reativar conta</button>,
}));

import { render, screen } from "@testing-library/react";
import ReactivateUser from "@/app/(private)/reactivate-user/page";
import { requireSession } from "@/lib/require-session";

describe("ReactivateUser page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-12T00:00:00.000Z"));
  });

  afterEach(() => vi.useRealTimers());

  it("should show the days left in plural", async () => {
    vi.mocked(requireSession).mockResolvedValue({
      user: {
        id: "john-doe",
        deletionRequestedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    } as never);

    render(await ReactivateUser());

    expect(screen.getByText(/Faltam/i)).toHaveTextContent(
      /Faltam 28 dias para a exclusão definitiva/i,
    );
    expect(
      screen.getByRole("button", { name: /reativar conta/i }),
    ).toBeInTheDocument();
  });

  it("should show the days left in singular", async () => {
    vi.mocked(requireSession).mockResolvedValue({
      user: {
        id: "john-doe",
        deletionRequestedAt: new Date(
          Date.now() - (30 * 86400000 - 1000),
        ).toISOString(),
      },
    } as never);

    render(await ReactivateUser());

    expect(screen.getByText(/Faltam/i)).toHaveTextContent(
      /Faltam 1 dia para a exclusão definitiva/i,
    );
  });
});
