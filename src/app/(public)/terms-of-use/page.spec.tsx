import { render, screen } from "@testing-library/react";
import TermsOfUse from "@/app/(public)/terms-of-use/page";

describe("TermsOfUse page", () => {
  it("should render the heading and the last update", () => {
    render(<TermsOfUse />);

    expect(
      screen.getByRole("heading", { name: /termos de uso/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Última atualização:")).toBeInTheDocument();
    expect(screen.getByText("31/07/2026")).toBeInTheDocument();
  });

  it("should render the service section", () => {
    render(<TermsOfUse />);

    expect(screen.getByText(/1\. sobre o serviço/i)).toBeInTheDocument();
  });
});
