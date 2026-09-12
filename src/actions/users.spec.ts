import { createMockedUsersDeletionRepository } from "@/adapters/shared/users-deletion.repository.mock";

vi.mock("@/adapters", () => ({ getUsersDeletionRepository: vi.fn() }));
vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { requestUserDeletion, cancelUserDeletion } from "./users";
import { getUsersDeletionRepository } from "@/adapters";
import { requireSession } from "@/lib/require-session";
import { redirect } from "next/navigation";

describe("users actions", () => {
  beforeEach(() => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as Awaited<ReturnType<typeof requireSession>>);
    vi.mocked(getUsersDeletionRepository).mockReturnValue(
      createMockedUsersDeletionRepository(),
    );
  });

  describe("requestUserDeletion", () => {
    it("should flag the account as pending deletion and redirect to /login", async () => {
      const repository = createMockedUsersDeletionRepository();
      vi.mocked(getUsersDeletionRepository).mockReturnValue(repository);

      await requestUserDeletion();

      expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
        "john-doe",
        "pending_deletion",
        expect.any(Date),
      );
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("cancelUserDeletion", () => {
    it("should restore the account to active and redirect to /tasks", async () => {
      const repository = createMockedUsersDeletionRepository();
      vi.mocked(getUsersDeletionRepository).mockReturnValue(repository);

      await cancelUserDeletion();

      expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
        "john-doe",
        "active",
        null,
      );
      expect(redirect).toHaveBeenCalledWith("/tasks");
    });
  });
});
