import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/adapters/actions/account", () => ({ requestAccountDeletion: vi.fn() }));

import { RequestUserDeletionDialog } from "@/view/components/account/request-user-deletion-dialog";
import { requestAccountDeletion } from "@/adapters/actions/account";

describe("RequestUserDeletionDialog", () => {
  it("should open the dialog and confirm the deletion", async () => {
    vi.mocked(requestAccountDeletion).mockResolvedValue(undefined as never);
    const user = userEvent.setup();
    render(<RequestUserDeletionDialog />);

    await user.click(screen.getByRole("button", { name: /excluir conta/i }));

    expect(await screen.findByText("Excluir sua conta?")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /confirmar exclusão/i }),
    );

    await waitFor(() => expect(requestAccountDeletion).toHaveBeenCalledTimes(1));
  });

  it("should close the dialog when canceling", async () => {
    const user = userEvent.setup();
    render(<RequestUserDeletionDialog />);

    await user.click(screen.getByRole("button", { name: /excluir conta/i }));
    await screen.findByText("Excluir sua conta?");

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    await waitFor(() =>
      expect(screen.queryByText("Excluir sua conta?")).not.toBeInTheDocument(),
    );
  });
});
