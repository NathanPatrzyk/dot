import { UserDeletionRepository } from "../ports/user-deletion-repository";

const DELETION_COOLDOWN_MS = 2592000000;

export function createUsersDeletionService(userDeletionRepository: UserDeletionRepository) {
  async function requestDeletion(userId: string) {
    await userDeletionRepository.updateDeletionStatus(userId, "pending_deletion", new Date());
  }

  async function cancelDeletion(userId: string) {
    await userDeletionRepository.updateDeletionStatus(userId, "active", null);
  }

  async function purgeExpiredAccounts() {
    const cutoffDate = new Date(Date.now() - DELETION_COOLDOWN_MS);
    const expiredUsers = await userDeletionRepository.findExpiredDeletions(cutoffDate);

    for (const user of expiredUsers) {
      await userDeletionRepository.purge(user.id);
    }
  }

  return { requestDeletion, cancelDeletion, purgeExpiredAccounts };
}
