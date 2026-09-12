vi.mock("@/adapters", () => ({ getDb: vi.fn() }));
vi.mock("better-auth", () => ({ betterAuth: vi.fn() }));
vi.mock("better-auth/adapters/drizzle", () => ({ drizzleAdapter: vi.fn() }));

import { getAuth } from "@/lib/auth";
import { getDb } from "@/adapters";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

describe("getAuth", () => {
  const adapter = { adapter: "mocked" } as never;

  beforeEach(() => {
    vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
    vi.stubEnv("GOOGLE_CLIENT_SECRET", "google-client-secret");
    vi.mocked(getDb).mockReturnValue({ db: "mocked" } as never);
    vi.mocked(drizzleAdapter).mockReturnValue(adapter);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("should configure betterAuth with the drizzle adapter", () => {
    getAuth();

    expect(drizzleAdapter).toHaveBeenCalledWith(
      { db: "mocked" },
      expect.objectContaining({
        provider: "sqlite",
        usePlural: true,
      }),
    );
    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        database: adapter,
        trustedOrigins: ["http://localhost:8787", "http://localhost:3000"],
      }),
    );
  });

  it("should register the user additional fields", () => {
    getAuth();

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        user: {
          additionalFields: {
            status: {
              type: "string",
              defaultValue: "active",
              input: false,
            },
            deletionRequestedAt: {
              type: "date",
              required: false,
              input: false,
            },
          },
        },
      }),
    );
  });

  it("should configure google as a social provider", () => {
    getAuth();

    expect(betterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        socialProviders: {
          google: {
            clientId: "google-client-id",
            clientSecret: "google-client-secret",
          },
        },
      }),
    );
  });
});
