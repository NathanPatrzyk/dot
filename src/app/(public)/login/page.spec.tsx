import { render, screen } from "@testing-library/react";
import Login from "./page";

jest.mock("@/components/google-button", () => ({
  GoogleButton: () => <div>GoogleButton</div>,
}));

describe("Login", () => {
  it("renders the title and google button", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "dot • Tarefas",
    );
    expect(screen.getByText("GoogleButton")).toBeInTheDocument();
  });

  it("renders links to privacy policy and terms of use", () => {
    render(<Login />);

    expect(
      screen.getByRole("link", { name: "Política de Privacidade" }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(screen.getByRole("link", { name: "Termos de Uso" })).toHaveAttribute(
      "href",
      "/terms-of-use",
    );
  });
});
