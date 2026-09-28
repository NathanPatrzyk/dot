vi.mock("next/headers", () => ({ headers: vi.fn() }));
vi.mock("@/adapters/auth/better-auth.config", () => ({ getAuth: vi.fn() }));

import { createAuthProvider } from "@/adapters/auth/auth-provider.adapter";
import { getAuth } from "@/adapters/auth/better-auth.config";
import { headers } from "next/headers";

type BetterAuthSession = {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
    deletionRequestedAt: Date | null;
  };
  session: { expiresAt: string };
};

function mockBetterAuth(session: BetterAuthSession | null) {
  const getSession = vi.fn(async () => session);
  vi.mocked(getAuth).mockReturnValue({ api: { getSession } } as never);
  return getSession;
}

describe("auth provider adapter", () => {
  afterEach(() => vi.clearAllMocks());

  it("should map the better-auth session into the auth session", async () => {
    const getSession = mockBetterAuth({
      user: {
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
        status: "pending_deletion",
        deletionRequestedAt: new Date("2026-03-15T12:00:00.000Z"),
      },
      session: { expiresAt: "2026-04-15T12:00:00.000Z" },
    });
    const requestHeaders = new Headers({ cookie: "session=token" });

    const session = await createAuthProvider().getSession(requestHeaders);

    expect(session).toEqual({
      user: {
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
        status: "pending_deletion",
        deletionRequestedAt: new Date("2026-03-15T12:00:00.000Z"),
      },
      expiresAt: new Date("2026-04-15T12:00:00.000Z"),
    });
    expect(getSession).toHaveBeenCalledWith({ headers: requestHeaders });
  });

  it("should normalize an unknown status to active and a missing date to null", async () => {
    mockBetterAuth({
      user: {
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
        status: "something-else",
        deletionRequestedAt: null,
      },
      session: { expiresAt: "2026-04-15T12:00:00.000Z" },
    });

    const session = await createAuthProvider().getSession(new Headers());

    expect(session?.user).toMatchObject({
      status: "active",
      deletionRequestedAt: null,
    });
  });

  it("should return null when better-auth has no session", async () => {
    mockBetterAuth(null);

    await expect(
      createAuthProvider().getSession(new Headers()),
    ).resolves.toBeNull();
  });

  it("should fall back to the request headers when none are given", async () => {
    const getSession = mockBetterAuth(null);
    const requestHeaders = new Headers({ cookie: "session=token" });
    vi.mocked(headers).mockResolvedValue(requestHeaders as never);

    await createAuthProvider().getSession();

    expect(getSession).toHaveBeenCalledWith({ headers: requestHeaders });
  });
});
