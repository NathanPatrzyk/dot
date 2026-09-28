vi.mock("@/adapters", () => ({ getAuthProvider: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { getAuthProvider } from "@/adapters";
import { createMockedAuthProvider } from "@/adapters/auth/auth-provider.adapter.mock";
import { getSession, requireSession } from "@/adapters/auth/session";
import { redirect } from "next/navigation";

describe("getSession", () => {
  it("should return the session resolved by the auth provider", async () => {
    const session = {
      user: {
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
        status: "active" as const,
        deletionRequestedAt: null,
      },
      expiresAt: new Date("2026-04-15T12:00:00.000Z"),
    };
    const authProvider = createMockedAuthProvider({
      getSession: vi.fn(async () => session),
    });
    vi.mocked(getAuthProvider).mockReturnValue(authProvider);

    await expect(getSession()).resolves.toEqual(session);
  });

  it("should return null when there is no session", async () => {
    vi.mocked(getAuthProvider).mockReturnValue(createMockedAuthProvider());

    await expect(getSession()).resolves.toBeNull();
  });
});

describe("requireSession", () => {
  it("should return the session when it exists", async () => {
    const session = {
      user: {
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
        status: "active" as const,
        deletionRequestedAt: null,
      },
      expiresAt: new Date("2026-04-15T12:00:00.000Z"),
    };
    vi.mocked(getAuthProvider).mockReturnValue(
      createMockedAuthProvider({ getSession: vi.fn(async () => session) }),
    );

    const result = await requireSession();

    expect(result).toEqual(session);
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect to /login when there is no session", async () => {
    vi.mocked(getAuthProvider).mockReturnValue(createMockedAuthProvider());

    await requireSession();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
