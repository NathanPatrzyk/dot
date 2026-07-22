import { render } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders as horizontal by default", () => {
    const { container } = render(<Separator />);

    expect(container.firstChild).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("renders as vertical when orientation is set", () => {
    const { container } = render(<Separator orientation="vertical" />);

    expect(container.firstChild).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("has data-slot separator", () => {
    const { container } = render(<Separator />);

    expect(container.firstChild).toHaveAttribute("data-slot", "separator");
  });

  it("merges custom className", () => {
    const { container } = render(<Separator className="my-custom-class" />);

    expect(container.firstChild).toHaveClass("my-custom-class");
  });
});
