import { render, screen } from "@testing-library/react";
import { requireSession } from "@/lib/require-session";
import PrivateLayout from "./layout";

jest.mock("@/lib/require-session", () => ({
  requireSession: jest.fn(),
}));

const mockRequireSession = requireSession as jest.Mock;

describe("PrivateLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children when the session is valid", async () => {
    mockRequireSession.mockResolvedValue({
      user: { id: "1", name: "Nathan" },
    });

    const jsx = await PrivateLayout({
      children: <div>conteúdo privado</div>,
    });
    render(jsx);

    expect(screen.getByText("conteúdo privado")).toBeInTheDocument();
    expect(mockRequireSession).toHaveBeenCalled();
  });
});
