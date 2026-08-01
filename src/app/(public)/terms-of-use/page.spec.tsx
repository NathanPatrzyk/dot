import { render, screen } from "@testing-library/react";
import TermsOfUse from "./page";

describe("TermsOfUse", () => {
  it("renders the page title", () => {
    render(<TermsOfUse />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Termos de Uso • dot",
    );
  });

  it("renders the last updated date", () => {
    render(<TermsOfUse />);

    expect(screen.getByText("31/07/2026")).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<TermsOfUse />);

    expect(screen.getByText(/nathanpatrzyk11@gmail\.com/)).toBeInTheDocument();
  });
});
