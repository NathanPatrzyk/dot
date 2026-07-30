import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";

import Home from "./page";

jest.mock("@/lib/get-session", () => ({
  getSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("Home", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /tasks when user is authenticated", async () => {
    mockGetSession.mockResolvedValue({
      session: {
        id: "session-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "1",
        expiresAt: new Date(),
        token: "token",
        ipAddress: null,
        userAgent: null,
      },

      user: {
        id: "1",
        name: "Nathan",
        email: "nathan@example.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await Home();

    expect(mockRedirect).toHaveBeenCalledWith("/tasks");
  });

  it("redirects to /login when user is not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    await Home();

    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});
