vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "mock-geist" }),
  Geist_Mono: () => ({ variable: "mock-geist-mono" }),
}));
vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("should render the root structure with children", () => {
    render(
      <RootLayout>
        <p>content</p>
      </RootLayout>,
    );

    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveClass("antialiased");
    expect(document.documentElement).toHaveClass("mock-geist");
    expect(document.documentElement).toHaveClass("mock-geist-mono");
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });
});
