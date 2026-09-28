import { createMockedCategoryRepository } from "@/adapters/repositories/category.repository.mock";
import { createCategoryService } from "./category.service";

describe("category service", () => {
  it("should return the categories belonging to the given user", async () => {
    const repository = createMockedCategoryRepository({
      findAllByUser: vi.fn(async () => [{ id: 1, name: "Casa" }]),
    });

    const categories =
      await createCategoryService(repository).getCategories("john-doe");

    expect(categories).toEqual([{ id: 1, name: "Casa" }]);
    expect(repository.findAllByUser).toHaveBeenCalledWith("john-doe");
  });

  it("should throw when creating a category with the reserved slug", async () => {
    const repository = createMockedCategoryRepository();

    await expect(
      createCategoryService(repository).createCategory(
        { name: "Sem Titulo" },
        "john-doe",
      ),
    ).rejects.toThrow("Esse nome de categoria não pode ser utilizado.");

    expect(repository.findByName).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should throw when a category with the same name already exists", async () => {
    const repository = createMockedCategoryRepository({
      findByName: vi.fn(async () => ({ id: 1, name: "Casa" })),
    });

    await expect(
      createCategoryService(repository).createCategory(
        { name: "Casa" },
        "john-doe",
      ),
    ).rejects.toThrow("Já existe uma categoria com esse nome.");

    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should create the category and forward the input", async () => {
    const repository = createMockedCategoryRepository();

    const category = await createCategoryService(repository).createCategory(
      { name: "Casa" },
      "john-doe",
    );

    expect(category).toMatchObject({ id: 1, name: "Casa" });
    expect(repository.findByName).toHaveBeenCalledWith("Casa", "john-doe");
    expect(repository.create).toHaveBeenCalledWith(
      { name: "Casa" },
      "john-doe",
    );
  });

  it("should throw when deleting a category that does not exist", async () => {
    const repository = createMockedCategoryRepository();

    await expect(
      createCategoryService(repository).deleteCategory(404, "john-doe"),
    ).rejects.toThrow("Categoria não encontrada.");

    expect(repository.findById).toHaveBeenCalledWith(404, "john-doe");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("should soft-delete an existing category", async () => {
    const repository = createMockedCategoryRepository({
      findById: vi.fn(async () => ({ id: 1, name: "Casa" })),
    });

    await createCategoryService(repository).deleteCategory(1, "john-doe");

    expect(repository.update).toHaveBeenCalledWith(1, "john-doe", {
      deletedAt: expect.any(Date),
    });
  });
});
