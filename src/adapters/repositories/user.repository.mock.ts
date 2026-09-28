import type { UserStatus, UserView } from "@/core/entities/user";
import type { PendingDeletionUser } from "@/core/ports/user-repository.port";
import { Mock } from "vitest";

export type MockedUserRepository = {
  findById: Mock<(id: string) => Promise<UserView | null>>;
  updateDeletionStatus: Mock<
    (
      id: string,
      status: UserStatus,
      deletionRequestedAt: Date | null,
    ) => Promise<void>
  >;
  findExpiredDeletions: Mock<
    (cutoffDate: Date) => Promise<PendingDeletionUser[]>
  >;
  purge: Mock<(id: string) => Promise<void>>;
};

export function createMockedUserRepository(
  overrides: Partial<MockedUserRepository> = {},
): MockedUserRepository {
  return {
    findById: vi.fn(async (_id: string): Promise<UserView | null> => null),
    updateDeletionStatus: vi.fn(async (): Promise<void> => undefined),
    findExpiredDeletions: vi.fn(
      async (_cutoffDate: Date): Promise<PendingDeletionUser[]> => [],
    ),
    purge: vi.fn(async (): Promise<void> => undefined),
    ...overrides,
  };
}
