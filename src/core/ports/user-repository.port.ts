import type { User, UserStatus, UserView } from "@/core/entities/user";

export type PendingDeletionUser = Pick<User, "id">;

export interface UserRepository {
  findById(id: string): Promise<UserView | null>;

  updateDeletionStatus(
    id: string,
    status: UserStatus,
    deletionRequestedAt: Date | null,
  ): Promise<void>;

  findExpiredDeletions(cutoffDate: Date): Promise<PendingDeletionUser[]>;

  purge(id: string): Promise<void>;
}
