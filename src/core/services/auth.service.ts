import { AuthProvider } from "@/core/ports/auth-provider.port";
import { UserRepository } from "@/core/ports/user-repository.port";

const DELETION_COOLDOWN_MS = 2592000000;

export function createAuthService(
  authProvider: AuthProvider,
  userRepository: UserRepository,
) {
  async function getSession() {
    return authProvider.getSession();
  }

  async function requestAccountDeletion(userId: string) {
    await userRepository.updateDeletionStatus(
      userId,
      "pending_deletion",
      new Date(),
    );
  }

  async function cancelAccountDeletion(userId: string) {
    await userRepository.updateDeletionStatus(userId, "active", null);
  }

  async function purgeExpiredAccounts() {
    const cutoffDate = new Date(Date.now() - DELETION_COOLDOWN_MS);
    const expiredUsers = await userRepository.findExpiredDeletions(cutoffDate);

    for (const user of expiredUsers) {
      await userRepository.purge(user.id);
    }
  }

  return {
    getSession,
    requestAccountDeletion,
    cancelAccountDeletion,
    purgeExpiredAccounts,
  };
}
