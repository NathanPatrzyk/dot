import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogFooter } from "./dialog";

describe("Dialog", () => {
  it("should render a close button in the footer when requested", () => {
    render(
      <Dialog open>
        <DialogFooter showCloseButton>footer</DialogFooter>
      </Dialog>,
    );

    expect(screen.getByText("footer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("should not render a close button in the footer by default", () => {
    render(
      <Dialog open>
        <DialogFooter>footer</DialogFooter>
      </Dialog>,
    );

    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  it("should render the content close button by default", () => {
    render(
      <Dialog open>
        <DialogContent>body</DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("should hide the content close button when disabled", () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>body</DialogContent>
      </Dialog>,
    );

    expect(screen.getByText("body")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });
});
