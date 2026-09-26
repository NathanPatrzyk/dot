import { createCategoriesRepository } from "./categories.repository";
import { users } from "@/db/schema";
import type { CategoriesRepository } from "@/core/ports/categories.repository";
import { createTestDb, TestDb } from "@/test-utils/db.test-util";

describe("categories repository (sqlite)", () => {
  let sqlite: TestDb["sqlite"];
  let db: TestDb["db"];
  let repository: CategoriesRepository;

  beforeEach(() => {
    ({ db, sqlite } = createTestDb());
    repository = createCategoriesRepository(() => db);

    db.insert(users)
      .values({ id: "john-doe", name: "John Doe", email: "john@doe.dev" })
      .run();
    db.insert(users)
      .values({ id: "jane-doe", name: "Jane Doe", email: "jane@doe.dev" })
      .run();
  });

  afterEach(() => sqlite.close());

  it("should create a category and list it for the owner", async () => {
    const category = await repository.create({ name: "Casa" }, "john-doe");

    expect(category).toMatchObject({ id: 1, name: "Casa" });

    const all = await repository.findAllByUser("john-doe");
    expect(all).toEqual([{ id: 1, name: "Casa" }]);
  });

  it("should list categories from newest to oldest", async () => {
    await repository.create({ name: "Casa" }, "john-doe");
    await repository.create({ name: "Estudos" }, "john-doe");

    const all = await repository.findAllByUser("john-doe");

    expect(all.map((category) => category.name)).toEqual(["Estudos", "Casa"]);
  });

  it("should hide soft-deleted categories and categories of other users", async () => {
    const category = await repository.create({ name: "Casa" }, "john-doe");
    await repository.create({ name: "Jogos" }, "jane-doe");
    await repository.update(category.id, "john-doe", { deletedAt: new Date() });

    const all = await repository.findAllByUser("john-doe");

    expect(all).toHaveLength(0);
  });

  it("should not return a category that belongs to another user", async () => {
    const category = await repository.create({ name: "Casa" }, "john-doe");

    await expect(
      repository.findById(category.id, "jane-doe"),
    ).resolves.toBeNull();
    expect(await repository.findById(category.id, "john-doe")).not.toBeNull();
  });

  it("should find a category by name scoped to the owner", async () => {
    await repository.create({ name: "Casa" }, "john-doe");

    await expect(repository.findByName("Casa", "jane-doe")).resolves.toBeNull();
    expect(await repository.findByName("Casa", "john-doe")).not.toBeNull();
  });

  it("should update the category scoped to the owner", async () => {
    const category = await repository.create({ name: "Casa" }, "john-doe");

    await repository.update(category.id, "john-doe", { name: "Casarão" });

    expect(await repository.findById(category.id, "john-doe")).toMatchObject({
      name: "Casarão",
    });
  });

  it("should not update a category of another user", async () => {
    const category = await repository.create({ name: "Casa" }, "john-doe");

    await repository.update(category.id, "jane-doe", { name: "Casarão" });

    expect(await repository.findById(category.id, "john-doe")).toMatchObject({
      name: "Casa",
    });
  });
});
