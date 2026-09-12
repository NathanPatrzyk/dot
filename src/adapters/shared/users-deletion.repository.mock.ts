import type { PendingDeletionUser } from "@/core/ports/users-deletion.repository";
import { type Mock } from "vitest";

export type MockedUsersDeletionRepository = {
  updateDeletionStatus: Mock<
    (
      id: string,
      status: "active" | "pending_deletion",
      deletionRequestedAt: Date | null,
    ) => Promise<void>
  >;
  findExpiredDeletions: Mock<
    (cutoffDate: Date) => Promise<PendingDeletionUser[]>
  >;
  purge: Mock<(id: string) => Promise<void>>;
};

export function createMockedUsersDeletionRepository(
  overrides: Partial<MockedUsersDeletionRepository> = {},
): MockedUsersDeletionRepository {
  return {
    updateDeletionStatus: vi.fn(
      async (
        _id: string,
        _status: "active" | "pending_deletion",
        _deletionRequestedAt: Date | null,
      ): Promise<void> => undefined,
    ),
    findExpiredDeletions: vi.fn(
      async (_cutoffDate: Date): Promise<PendingDeletionUser[]> => [],
    ),
    purge: vi.fn(async (_id: string): Promise<void> => undefined),
    ...overrides,
  };
}
