import { users } from "@/db/schema";
import { createUsersRepository } from "@/adapters/shared/users.repository";
import type { UsersRepository } from "@/core/ports/users.repository";
import { createTestDb, TestDb } from "@/test-utils/db.test-util";

describe("users repository (sqlite)", () => {
  let sqlite: TestDb["sqlite"];
  let db: TestDb["db"];
  let repository: UsersRepository;

  beforeEach(() => {
    ({ db, sqlite } = createTestDb());
    repository = createUsersRepository(() => db);
  });

  afterEach(() => sqlite.close());

  it("should find the user by id", async () => {
    db.insert(users)
      .values({ id: "john-doe", name: "John Doe", email: "john@doe.dev" })
      .run();

    const user = await repository.findById("john-doe");

    expect(user).toMatchObject({
      id: "john-doe",
      name: "John Doe",
      email: "john@doe.dev",
    });
  });

  it("should return null when the user does not exist", async () => {
    await expect(repository.findById("ghost")).resolves.toBeNull();
  });
});
