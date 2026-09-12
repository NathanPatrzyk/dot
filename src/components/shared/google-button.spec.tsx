import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/auth-client", () => ({
  authClient: { signIn: { social: vi.fn() } },
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

import { GoogleButton } from "@/components/shared/google-button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

describe("GoogleButton", () => {
  it("should sign in with google and a callback to /tasks", async () => {
    vi.mocked(authClient.signIn.social).mockResolvedValue({} as never);
    const user = userEvent.setup();
    render(<GoogleButton />);

    await user.click(
      screen.getByRole("button", { name: /entrar com google/i }),
    );

    await waitFor(() =>
      expect(authClient.signIn.social).toHaveBeenCalledWith({
        provider: "google",
        callbackURL: "/tasks",
      }),
    );
  });

  it("should toast an error when signing in fails", async () => {
    vi.mocked(authClient.signIn.social).mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<GoogleButton />);

    await user.click(
      screen.getByRole("button", { name: /entrar com google/i }),
    );

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Erro ao entrar com Google"),
    );
  });
});
