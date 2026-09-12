import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/actions/users", () => ({ requestUserDeletion: vi.fn() }));

import { RequestUserDeletionDialog } from "@/components/shared/request-user-deletion-dialog";
import { requestUserDeletion } from "@/actions/users";

describe("RequestUserDeletionDialog", () => {
  it("should open the dialog and confirm the deletion", async () => {
    vi.mocked(requestUserDeletion).mockResolvedValue(undefined as never);
    const user = userEvent.setup();
    render(<RequestUserDeletionDialog />);

    await user.click(screen.getByRole("button", { name: /excluir conta/i }));

    expect(await screen.findByText("Excluir sua conta?")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /confirmar exclusão/i }),
    );

    await waitFor(() => expect(requestUserDeletion).toHaveBeenCalledTimes(1));
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
