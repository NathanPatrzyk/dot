import { createUserRepository } from "@/adapters/repositories/user.repository";
import { users } from "@/adapters/db/schema";
import type { UserRepository } from "@/core/ports/user-repository.port";
import { createTestDb, TestDb } from "@/__test__/db.test-util";
import { eq } from "drizzle-orm";

describe("user repository (sqlite)", () => {
  let sqlite: TestDb["sqlite"];
  let db: TestDb["db"];
  let repository: UserRepository;

  beforeEach(() => {
    ({ db, sqlite } = createTestDb());
    repository = createUserRepository(() => db);
  });

  afterEach(() => sqlite.close());

  function insertUser(id: string, name: string, email: string) {
    db.insert(users).values({ id, name, email }).run();
  }

  it("should find the user by id", async () => {
    insertUser("john-doe", "John Doe", "john@doe.dev");

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

  it("should mark the user as pending deletion with the requested date", async () => {
    insertUser("john-doe", "John Doe", "john@doe.dev");

    await repository.updateDeletionStatus(
      "john-doe",
      "pending_deletion",
      new Date("2026-03-15T12:00:00.000Z"),
    );

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, "john-doe"));

    expect(user).toMatchObject({ status: "pending_deletion" });
    expect(user.deletionRequestedAt?.toISOString()).toBe(
      "2026-03-15T12:00:00.000Z",
    );
  });

  it("should restore the user to active when canceling deletion", async () => {
    insertUser("john-doe", "John Doe", "john@doe.dev");
    await repository.updateDeletionStatus(
      "john-doe",
      "pending_deletion",
      new Date("2026-03-15T12:00:00.000Z"),
    );

    await repository.updateDeletionStatus("john-doe", "active", null);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, "john-doe"));

    expect(user).toMatchObject({ status: "active" });
    expect(user.deletionRequestedAt).toBeNull();
  });

  it("should return only the pending users whose deletion expired", async () => {
    insertUser("expired-user", "Expired User", "expired@doe.dev");
    insertUser("fresh-user", "Fresh User", "fresh@doe.dev");
    insertUser("active-user", "Active User", "active@doe.dev");
    await repository.updateDeletionStatus(
      "expired-user",
      "pending_deletion",
      new Date("2026-02-01T00:00:00.000Z"),
    );
    await repository.updateDeletionStatus(
      "fresh-user",
      "pending_deletion",
      new Date("2026-03-01T00:00:00.000Z"),
    );
    await repository.updateDeletionStatus("active-user", "active", null);

    const expired = await repository.findExpiredDeletions(
      new Date("2026-02-15T00:00:00.000Z"),
    );

    expect(expired.map((user) => user.id)).toEqual(["expired-user"]);
  });

  it("should purge the user", async () => {
    insertUser("john-doe", "John Doe", "john@doe.dev");
    insertUser("jane-doe", "Jane Doe", "jane@doe.dev");

    await repository.purge("john-doe");

    const remaining = await db
      .select()
      .from(users)
      .where(eq(users.id, "john-doe"));

    expect(remaining).toHaveLength(0);
  });
});
