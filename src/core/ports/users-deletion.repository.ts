export type PendingDeletionUser = {
  id: string;
};

export interface UsersDeletionRepository {
  updateDeletionStatus(
    id: string,
    status: "active" | "pending_deletion",
    deletionRequestedAt: Date | null,
  ): Promise<void>;
  findExpiredDeletions(cutoffDate: Date): Promise<PendingDeletionUser[]>;
  
  purge(id: string): Promise<void>;
}