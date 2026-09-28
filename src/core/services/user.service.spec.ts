import { createUserService } from "@/core/services/user.service";
import { createMockedUserRepository } from "@/adapters/repositories/user.repository.mock";

describe("user service", () => {
  it("should return the user found by id", async () => {
    const repository = createMockedUserRepository({
      findById: vi.fn(async () => ({
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
      })),
    });
    const service = createUserService(repository);

    const user = await service.findUserById("john-doe");

    expect(user).toMatchObject({ id: "john-doe", name: "John Doe" });
    expect(repository.findById).toHaveBeenCalledWith("john-doe");
  });

  it("should return null when the user does not exist", async () => {
    const repository = createMockedUserRepository();
    const service = createUserService(repository);

    await expect(service.findUserById("ghost-user")).resolves.toBeNull();
  });
});
