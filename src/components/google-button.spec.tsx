import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";
import GoogleButton from "./google-button";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      social: jest.fn(),
    },
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
      screen.getByRole("button", { name: "Entrar com Google" }),
    ).toBeInTheDocument();
  });

  it("calls authClient.signIn.social with the google provider on click", async () => {
    const user = userEvent.setup();
    mockSignInSocial.mockResolvedValue(undefined);

    render(<GoogleButton />);

    await user.click(screen.getByRole("button", { name: "Entrar com Google" }));

    expect(mockSignInSocial).toHaveBeenCalledWith({ provider: "google" });
  });
});
