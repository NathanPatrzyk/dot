import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Login from "./page";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockSignInSocial = authClient.signIn.social as jest.Mock;

describe("Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title and login button", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "dot • Tarefas",
    );
    expect(
      screen.getByRole("button", { name: /Entrar com Google/ }),
    ).toBeInTheDocument();
  });

  it("calls authClient.signIn.social with the google provider on click", async () => {
    const user = userEvent.setup();
    let resolveSignIn: () => void;
    mockSignInSocial.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        }),
    );

    render(<Login />);

    await user.click(screen.getByRole("button", { name: /Entrar com Google/ }));

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/tasks",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Entrando.../ }),
      ).toBeInTheDocument();
    });

    resolveSignIn!();
  });

  it("shows an error toast and stops loading when sign in fails", async () => {
    const user = userEvent.setup();
    mockSignInSocial.mockRejectedValue(new Error("fail"));

    render(<Login />);

    await user.click(screen.getByRole("button", { name: /Entrar com Google/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao entrar com Google");
    });

    expect(
      screen.getByRole("button", { name: /Entrar com Google/ }),
    ).toBeInTheDocument();
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
