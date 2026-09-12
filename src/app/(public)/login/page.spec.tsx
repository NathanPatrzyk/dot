vi.mock("@/components/shared/google-button", () => ({
  GoogleButton: () => <button>Entrar com Google</button>,
}));

import { render, screen } from "@testing-library/react";
import Login from "@/app/(public)/login/page";

describe("Login page", () => {
  it("should render the login heading and the Google button", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      /dot • tarefas/i,
    );
    expect(
      screen.getByRole("button", { name: /entrar com google/i }),
    ).toBeInTheDocument();
  });

  it("should link to the privacy policy and terms of use", () => {
    render(<Login />);

    expect(
      screen.getByRole("link", { name: /política de privacidade/i }),
    ).toHaveAttribute("href", "/privacy-policy");
    expect(
      screen.getByRole("link", { name: /termos de uso/i }),
    ).toHaveAttribute("href", "/terms-of-use");
  });
});
