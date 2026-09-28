import { createMockedAuthProvider } from "@/adapters/auth/auth-provider.adapter.mock";
import { createMockedUserRepository } from "@/adapters/repositories/user.repository.mock";

vi.mock("@/adapters", () => ({
  getAuthProvider: vi.fn(),
  getUserRepository: vi.fn(),
}));
vi.mock("@/adapters/auth/session", () => ({ requireSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { requestAccountDeletion, cancelAccountDeletion } from "./account";
import { getAuthProvider, getUserRepository } from "@/adapters";
import { requireSession } from "@/adapters/auth/session";
import { redirect } from "next/navigation";

describe("account actions", () => {
  beforeEach(() => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as Awaited<ReturnType<typeof requireSession>>);
    vi.mocked(getAuthProvider).mockReturnValue(createMockedAuthProvider());
    vi.mocked(getUserRepository).mockReturnValue(createMockedUserRepository());
  });

  describe("requestAccountDeletion", () => {
    it("should flag the account as pending deletion and redirect to /login", async () => {
      const repository = createMockedUserRepository();
      vi.mocked(getUserRepository).mockReturnValue(repository);

      await requestAccountDeletion();

      expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
        "john-doe",
        "pending_deletion",
        expect.any(Date),
      );
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("cancelAccountDeletion", () => {
    it("should restore the account to active and redirect to /categories", async () => {
      const repository = createMockedUserRepository();
      vi.mocked(getUserRepository).mockReturnValue(repository);

      await cancelAccountDeletion();

      expect(repository.updateDeletionStatus).toHaveBeenCalledWith(
        "john-doe",
        "active",
        null,
      );
      expect(redirect).toHaveBeenCalledWith("/categories");
    });
  });
});
