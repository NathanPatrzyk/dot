import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryFormDialog } from "./category-form-dialog";

describe("CategoryFormDialog", () => {
  it("should open the dialog and submit the name", async () => {
    const action = vi.fn();
    const user = userEvent.setup();
    render(<CategoryFormDialog isPending={false} action={action} />);

    await user.click(screen.getByRole("button", { name: /nova categoria/i }));

    const input = await screen.findByPlaceholderText("Nome da categoria");
    await user.type(input, "Casa");
    await user.click(screen.getByRole("button", { name: /criar categoria/i }));

    expect(action).toHaveBeenCalledTimes(1);
    expect(action.mock.calls[0][0].get("name")).toBe("Casa");
  });

  it("should disable the fields while pending", async () => {
    const user = userEvent.setup();
    render(<CategoryFormDialog isPending={true} action={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /nova categoria/i }));

    const input = await screen.findByPlaceholderText("Nome da categoria");
    expect(input).toBeDisabled();

    const submit = screen.getByRole("button", { name: /criar categoria/i });
    expect(submit).toBeDisabled();
  });
});
