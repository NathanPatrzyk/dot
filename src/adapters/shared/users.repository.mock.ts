import type { UserRecord } from "@/core/ports/users.repository";
import { Mock } from "vitest";

export type MockedUsersRepository = {
  findById: Mock<(id: string) => Promise<UserRecord | null>>;
};

export function createMockedUsersRepository(
  overrides: Partial<MockedUsersRepository> = {},
): MockedUsersRepository {
  return {
    findById: vi.fn(async (_id: string): Promise<UserRecord | null> => null),
    ...overrides,
  };
}
