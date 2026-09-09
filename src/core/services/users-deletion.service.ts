import { UsersDeletionRepository } from "../ports/users-deletion.repository";

const DELETION_COOLDOWN_MS = 2592000000;

export function createUsersDeletionService(
  usersDeletionRepository: UsersDeletionRepository,
) {
  async function requestDeletion(userId: string) {
    await usersDeletionRepository.updateDeletionStatus(
      userId,
      "pending_deletion",
      new Date(),
    );
  }

  async function cancelDeletion(userId: string) {
    await usersDeletionRepository.updateDeletionStatus(userId, "active", null);
  }

  async function purgeExpiredAccounts() {
    const cutoffDate = new Date(Date.now() - DELETION_COOLDOWN_MS);
    const expiredUsers =
      await usersDeletionRepository.findExpiredDeletions(cutoffDate);

    for (const user of expiredUsers) {
      await usersDeletionRepository.purge(user.id);
    }
  }

  return { requestDeletion, cancelDeletion, purgeExpiredAccounts };
}
