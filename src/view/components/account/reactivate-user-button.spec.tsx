import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/adapters/actions/account", () => ({ cancelAccountDeletion: vi.fn() }));
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
        Promise.resolve(callback()).catch(() => undefined);
      };
      return [isPending, startTransition] as const;
    },
  } as typeof import("react");
});

import { ReactivateUserButton } from "@/view/components/account/reactivate-user-button";
import { cancelAccountDeletion } from "@/adapters/actions/account";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";

describe("ReactivateUserButton", () => {
  it("should cancel the user deletion", async () => {
    vi.mocked(cancelAccountDeletion).mockResolvedValue(undefined as never);
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    await user.click(screen.getByRole("button", { name: /reativar conta/i }));

    await waitFor(() => expect(cancelAccountDeletion).toHaveBeenCalledTimes(1));
  });

  it("should toast an error when reactivating fails", async () => {
    vi.mocked(cancelAccountDeletion).mockRejectedValue(new Error("network"));
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
    vi.mocked(cancelAccountDeletion).mockRejectedValue(new Error("redirect"));
    vi.mocked(isRedirectError).mockReturnValue(true);
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    await user.click(screen.getByRole("button", { name: /reativar conta/i }));

    await waitFor(() => expect(cancelAccountDeletion).toHaveBeenCalledTimes(1));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("should disable the button while the request is pending", async () => {
    let resolveDeletion!: (value: unknown) => void;
    vi.mocked(cancelAccountDeletion).mockReturnValue(
      new Promise((resolve) => {
        resolveDeletion = resolve;
      }) as never,
    );
    const user = userEvent.setup();
    render(<ReactivateUserButton />);

    const button = screen.getByRole("button", { name: /reativar conta/i });
    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());

    await act(async () => {
      resolveDeletion(undefined);
    });
  });
});
