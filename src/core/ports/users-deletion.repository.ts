export type PendingDeletionUserRecord = {
  id: string;
};

export interface UsersDeletionRepository {
  updateDeletionStatus(
    id: string,
    status: "active" | "pending_deletion",
    deletionRequestedAt: Date | null,
  ): Promise<void>;
  findExpiredDeletions(cutoffDate: Date): Promise<PendingDeletionUserRecord[]>;

  purge(id: string): Promise<void>;
}
