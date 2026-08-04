import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { GoogleButton } from "./google-button";

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

describe("GoogleButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login button", () => {
    render(<GoogleButton />);

    expect(
      screen.getByRole("button", { name: /Entrar com Google/ }),
    ).toBeInTheDocument();
  });

  it("calls authClient.signIn.social with the google provider and callback on click", async () => {
    const user = userEvent.setup();
    let resolveSignIn: () => void;
    mockSignInSocial.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve;
        }),
    );

    render(<GoogleButton />);

    await user.click(screen.getByRole("button", { name: /Entrar com Google/ }));

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/tasks",
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Entrar com Google/ }),
      ).toBeDisabled();
    });

    resolveSignIn!();
  });

  it("shows an error toast and re-enables the button when sign in fails", async () => {
    const user = userEvent.setup();
    mockSignInSocial.mockRejectedValue(new Error("fail"));

    render(<GoogleButton />);

    await user.click(screen.getByRole("button", { name: /Entrar com Google/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao entrar com Google");
    });

    expect(
      screen.getByRole("button", { name: /Entrar com Google/ }),
    ).not.toBeDisabled();
  });
});
