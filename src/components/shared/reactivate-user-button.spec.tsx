import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/actions/users", () => ({ cancelUserDeletion: vi.fn() }));
vi.mock("next/dist/client/components/redirect-error", () => ({
  isRedirectError: vi.fn(() => false),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return {
    ...actual,
    useTransition: () => {
      const [isPending, setPending] = actual.useState(false);
      const startTransition = (callback: () => unknown) => {
        setPending(true);
        let result: unknown;
        try {
          result = callback();
        } catch (error) {
          setPending(false);
          throw error;
        }
        Promise.resolve(result)
          .catch(() => undefined)
          .finally(() => {
            actual.act?.(() => setPending(false));
          });
      };
      return [isPending, startTransition] as const;
    },
  } as typeof import("react");
});

import { ReactivateUserButton } from "@/components/shared/reactivate-user-button";
import { cancelUserDeletion } from "@/actions/users";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";

describe("ReactivateUserButton", () => {
  it("should cancel the user deletion", async () => {
    vi.mocked(cancelUserDeletion).mockResolvedValue(undefined as never);
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    await user.click(screen.getByRole("button", { name: /reativar conta/i }));

    await waitFor(() => expect(cancelUserDeletion).toHaveBeenCalledTimes(1));
  });

  it("should toast an error when reactivating fails", async () => {
    vi.mocked(cancelUserDeletion).mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    await user.click(screen.getByRole("button", { name: /reativar conta/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Não foi possível reativar sua conta. Tente novamente.",
      ),
    );
  });

  it("should rethrow redirect errors without showing an error toast", async () => {
    vi.mocked(cancelUserDeletion).mockRejectedValue(new Error("redirect"));
    vi.mocked(isRedirectError).mockReturnValue(true);
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    await user.click(screen.getByRole("button", { name: /reativar conta/i }));

    await waitFor(() => expect(cancelUserDeletion).toHaveBeenCalledTimes(1));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should disable the button while the request is pending", async () => {
    let resolveDeletion!: (value: unknown) => void;
    vi.mocked(cancelUserDeletion).mockReturnValue(
      new Promise((resolve) => {
        resolveDeletion = resolve;
      }) as never,
    );
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    const button = screen.getByRole("button", { name: /reativar conta/i });
    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());

    resolveDeletion(undefined);
  });
});
