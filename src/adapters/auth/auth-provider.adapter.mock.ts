import type { AuthSession } from "@/core/ports/auth-provider.port";
import { Mock } from "vitest";

export type MockedAuthProvider = {
  getSession: Mock<(requestHeaders?: Headers) => Promise<AuthSession | null>>;
};

export function createMockedAuthProvider(
  overrides: Partial<MockedAuthProvider> = {},
): MockedAuthProvider {
  return {
    getSession: vi.fn(
      async (_requestHeaders?: Headers): Promise<AuthSession | null> => null,
    ),
    ...overrides,
  };
}
