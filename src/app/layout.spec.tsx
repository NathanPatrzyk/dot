import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";

describe("RootLayout", () => {
  it("renders children", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <RootLayout>
        <div>content</div>
      </RootLayout>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
