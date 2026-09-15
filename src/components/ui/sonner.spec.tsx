import { render, screen } from "@testing-library/react";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(() => ({ theme: "system" })),
}));
vi.mock("sonner", () => ({
  Toaster: (props: {
    theme?: string;
    className?: string;
    position?: string;
    toastOptions?: { classNames?: { toast?: string } };
  }) => (
    <div
      data-testid="sonner-toaster"
      data-theme={props.theme}
      data-class-name={props.className}
      data-position={props.position}
      data-toast-class={props.toastOptions?.classNames?.toast}
    />
  ),
}));

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";

describe("Toaster", () => {
  it("should render with the system theme by default", () => {
    render(<Toaster />);

    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toHaveAttribute("data-theme", "system");
    expect(toaster).toHaveAttribute("data-class-name", "toaster group");
    expect(toaster).toHaveAttribute("data-toast-class", "cn-toast");
  });

  it("should use the theme provided by next-themes", () => {
    vi.mocked(useTheme).mockReturnValue({ theme: "light" } as never);

    render(<Toaster />);

    expect(screen.getByTestId("sonner-toaster")).toHaveAttribute(
      "data-theme",
      "light",
    );
  });

  it("should pass through the remaining props", () => {
    render(<Toaster position="bottom-right" />);

    expect(screen.getByTestId("sonner-toaster")).toHaveAttribute(
      "data-position",
      "bottom-right",
    );
  });
});
