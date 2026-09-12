import { createUsersService } from "@/core/services/users.service";
import { createMockedUsersRepository } from "@/adapters/shared/users.repository.mock";

describe("users service", () => {
  it("should return the user found by id", async () => {
    const repository = createMockedUsersRepository({
      findById: vi.fn(async () => ({
        id: "john-doe",
        name: "John Doe",
        email: "john@doe.dev",
      })),
    });
    const service = createUsersService(repository);

    const user = await service.findUserById("john-doe");

    expect(user).toMatchObject({ id: "john-doe", name: "John Doe" });
    expect(repository.findById).toHaveBeenCalledWith("john-doe");
  });

  it("should return null when the user does not exist", async () => {
    const repository = createMockedUsersRepository();
    const service = createUsersService(repository);

    await expect(service.findUserById("ghost-user")).resolves.toBeNull();
  });
});
