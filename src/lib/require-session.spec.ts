import { redirect } from "next/navigation";
import { getSession } from "./get-session";
import { requireSession } from "./require-session";

jest.mock("./get-session", () => ({
  getSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetSession = getSession as jest.Mock;

describe("requireSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the session when it exists", async () => {
    const session = { user: { id: "1", name: "Nathan" } };
    mockGetSession.mockResolvedValue(session);

    const result = await requireSession();

    expect(result).toEqual(session);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("redirects to /login when there is no session", async () => {
    mockGetSession.mockResolvedValue(null);

    await requireSession();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
