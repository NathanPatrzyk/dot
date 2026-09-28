import { createMockedAuthProvider } from "@/adapters/auth/auth-provider.adapter.mock";
import { createMockedUserRepository } from "@/adapters/repositories/user.repository.mock";
import { createAuthService } from "@/core/services/auth.service";

describe("auth service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should delegate the session lookup to the auth provider", async () => {
    const session = {
      user: {
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
        status: "active" as const,
        deletionRequestedAt: null,
      },
      expiresAt: new Date("2026-04-15T12:00:00.000Z"),
    };
    const authProvider = createMockedAuthProvider({
      getSession: vi.fn(async () => session),
    });
    const service = createAuthService(
      authProvider,
      createMockedUserRepository(),
    );

    await expect(service.getSession()).resolves.toEqual(session);
    expect(authProvider.getSession).toHaveBeenCalledTimes(1);
  });

  it("should mark the account as pending deletion when requesting deletion", async () => {
    const repository = createMockedUserRepository();
    const service = createAuthService(createMockedAuthProvider(), repository);

    await service.requestAccountDeletion("john-doe");

    expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
      "john-doe",
      "pending_deletion",
      new Date("2026-03-15T12:00:00.000Z"),
    );
  });

  it("should restore the account to active when canceling deletion", async () => {
    const repository = createMockedUserRepository();
    const service = createAuthService(createMockedAuthProvider(), repository);

    await service.cancelAccountDeletion("john-doe");

    expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
      "john-doe",
      "active",
      null,
    );
  });

  it("should purge only the accounts whose deletion expired 30 days ago", async () => {
    const repository = createMockedUserRepository({
      findExpiredDeletions: vi.fn(async () => [
        { id: "john-doe" },
        { id: "jane-doe" },
      ]),
    });
    const service = createAuthService(createMockedAuthProvider(), repository);

    await service.purgeExpiredAccounts();

    const [cutoffDate] = repository.findExpiredDeletions.mock.calls[0];
    expect(cutoffDate).toEqual(new Date("2026-02-13T12:00:00.000Z"));
    expect(repository.purge).toHaveBeenCalledTimes(2);
    expect(repository.purge).toHaveBeenCalledWith("john-doe");
    expect(repository.purge).toHaveBeenCalledWith("jane-doe");
  });

  it("should not purge any account when there are no expired deletions", async () => {
    const repository = createMockedUserRepository();
    const service = createAuthService(createMockedAuthProvider(), repository);

    await service.purgeExpiredAccounts();

    expect(repository.findExpiredDeletions).toHaveBeenCalledTimes(1);
    expect(repository.purge).not.toHaveBeenCalled();
  });
});
