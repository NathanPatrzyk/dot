vi.mock("better-auth/react", () => ({ createAuthClient: vi.fn() }));

import { createAuthClient } from "better-auth/react";

describe("authClient", () => {
  beforeEach(() => {
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
    vi.resetModules();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("should create the auth client with the base url from env", async () => {
    const { authClient } = await import("@/lib/auth-client");

    expect(createAuthClient).toHaveBeenCalledWith({
      baseURL: "http://localhost:3000",
    });
    expect(authClient).toBe(vi.mocked(createAuthClient).mock.results[0].value);
  });

  it("should reuse the same client instance on repeated imports", async () => {
    const { authClient: firstClient } = await import("@/lib/auth-client");
    const { authClient: secondClient } = await import("@/lib/auth-client");

    expect(firstClient).toBe(secondClient);
    expect(createAuthClient).toHaveBeenCalledTimes(1);
  });
});
