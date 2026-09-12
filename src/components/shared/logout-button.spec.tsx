import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/auth-client", () => ({ authClient: { signOut: vi.fn() } }));
vi.mock("next/navigation", () => ({ useRouter: vi.fn() }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

import { LogoutButton } from "@/components/shared/logout-button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

describe("LogoutButton", () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as never);
  });

  it("should sign out and navigate to /login", async () => {
    const push = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push } as never);
    vi.mocked(authClient.signOut).mockImplementation(
      async ({ fetchOptions } = {}) => {
        fetchOptions?.onSuccess?.({} as never);
      },
    );
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /sair/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/login"));
  });

  it("should toast an error when signing out fails", async () => {
    vi.mocked(authClient.signOut).mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /sair/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao sair"),
    );
  });
});
