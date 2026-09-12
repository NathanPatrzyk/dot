import { createUsersDeletionService } from "@/core/services/users-deletion.service";
import { createMockedUsersDeletionRepository } from "@/adapters/shared/users-deletion.repository.mock";

describe("users deletion service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should mark the account as pending deletion when requesting deletion", async () => {
    const repository = createMockedUsersDeletionRepository();
    const service = createUsersDeletionService(repository);

    await service.requestDeletion("john-doe");

    expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
      "john-doe",
      "pending_deletion",
      new Date("2026-03-15T12:00:00.000Z"),
    );
  });

  it("should restore the account to active when canceling deletion", async () => {
    const repository = createMockedUsersDeletionRepository();
    const service = createUsersDeletionService(repository);

    await service.cancelDeletion("john-doe");

    expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
      "john-doe",
      "active",
      null,
    );
  });

  it("should purge only the accounts whose deletion expired 30 days ago", async () => {
    const repository = createMockedUsersDeletionRepository({
      findExpiredDeletions: vi.fn(async () => [
        { id: "john-doe" },
        { id: "jane-doe" },
      ]),
    });
    const service = createUsersDeletionService(repository);

    await service.purgeExpiredAccounts();

    const [cutoffDate] = repository.findExpiredDeletions.mock.calls[0];
    expect(cutoffDate).toEqual(new Date("2026-02-13T12:00:00.000Z"));
    expect(repository.purge).toHaveBeenCalledTimes(2);
    expect(repository.purge).toHaveBeenCalledWith("john-doe");
    expect(repository.purge).toHaveBeenCalledWith("jane-doe");
  });

  it("should not purge any account when there are no expired deletions", async () => {
    const repository = createMockedUsersDeletionRepository();
    const service = createUsersDeletionService(repository);

    await service.purgeExpiredAccounts();

    expect(repository.findExpiredDeletions).toHaveBeenCalledTimes(1);
    expect(repository.purge).not.toHaveBeenCalled();
  });
});
