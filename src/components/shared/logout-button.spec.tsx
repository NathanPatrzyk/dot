import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogoutButton } from "./logout-button";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockSignOut = authClient.signOut as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockPush = jest.fn();

describe("LogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
  });

  it("renders the logout button", () => {
    render(<LogoutButton />);

    expect(screen.getByRole("button", { name: /Sair/ })).toBeInTheDocument();
  });

  it("calls signOut and redirects to /login on success", async () => {
    const user = userEvent.setup();
    mockSignOut.mockImplementation(async ({ fetchOptions }) => {
      fetchOptions.onSuccess();
    });

    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /Sair/ }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("shows an error toast when signOut fails", async () => {
    const user = userEvent.setup();
    mockSignOut.mockRejectedValue(new Error("fail"));

    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /Sair/ }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao sair");
    });
  });
});
