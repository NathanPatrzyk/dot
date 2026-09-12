import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "@/app/(public)/privacy-policy/page";

describe("PrivacyPolicy page", () => {
  it("should render the heading and the last update", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByRole("heading", { name: /política de privacidade/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Última atualização:")).toBeInTheDocument();
    expect(screen.getByText("31/07/2026")).toBeInTheDocument();
  });

  it("should render the LGPD section", () => {
    render(<PrivacyPolicy />);

    expect(
      screen.getByText(/1\. quem é o responsável pelos dados/i),
    ).toBeInTheDocument();
  });
});
