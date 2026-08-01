import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "./page";

describe("PrivacyPolicy", () => {
  it("renders the page title", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Política de Privacidade • dot",
    );
  });

  it("renders the last updated date", () => {
    render(<PrivacyPolicy />);

    expect(screen.getByText("31/07/2026")).toBeInTheDocument();
  });

  it("renders the contact email", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getAllByText(/nathanpatrzyk11@gmail\.com/).length,
    ).toBeGreaterThan(0);
  });
});
