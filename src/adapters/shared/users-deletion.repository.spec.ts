import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { createUsersDeletionRepository } from "./users-deletion.repository";
import type { UsersDeletionRepository } from "@/core/ports/users-deletion.repository";
import { createTestDb, TestDb } from "@/test-utils/db.test-util";

describe("users deletion repository (sqlite)", () => {
  let sqlite: TestDb["sqlite"];
  let db: TestDb["db"];
  let repository: UsersDeletionRepository;

  beforeEach(() => {
    ({ db, sqlite } = createTestDb());
    repository = createUsersDeletionRepository(() => db);
  });

  afterEach(() => sqlite.close());

  it("should mark the user as pending deletion with the requested date", async () => {
    db.insert(users)
      .values({ id: "john-doe", name: "John Doe", email: "john@doe.dev" })
      .run();

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
    db.insert(users)
      .values({ id: "john-doe", name: "John Doe", email: "john@doe.dev" })
      .run();
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
    db.insert(users)
      .values([
        { id: "expired-user", name: "Expired User", email: "expired@doe.dev" },
        { id: "fresh-user", name: "Fresh User", email: "fresh@doe.dev" },
        { id: "active-user", name: "Active User", email: "active@doe.dev" },
      ])
      .run();
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
    db.insert(users)
      .values([
        { id: "john-doe", name: "John Doe", email: "john@doe.dev" },
        { id: "jane-doe", name: "Jane Doe", email: "jane@doe.dev" },
      ])
      .run();

    await repository.purge("john-doe");

    const remaining = await db
      .select()
      .from(users)
      .where(eq(users.id, "john-doe"));

    expect(remaining).toHaveLength(0);
  });
});
