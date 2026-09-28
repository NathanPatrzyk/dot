import { createMockedCategoryRepository } from "@/adapters/repositories/category.repository.mock";

vi.mock("@/adapters", () => ({
  getCategoryRepository: vi.fn(),
}));

import { getCategoryRepository } from "@/adapters";
import { getCategories } from "@/adapters/queries/categories";

describe("getCategories query", () => {
  it("should return the categories for the given user", async () => {
    const repository = createMockedCategoryRepository({
      findAllByUser: vi.fn(async () => [
        { id: 2, name: "Estudos" },
        { id: 1, name: "Casa" },
      ]),
    });
    vi.mocked(getCategoryRepository).mockReturnValue(repository);

    const categories = await getCategories("john-doe");

    expect(categories).toEqual([
      { id: 2, name: "Estudos" },
      { id: 1, name: "Casa" },
    ]);
    expect(repository.findAllByUser).toHaveBeenCalledWith("john-doe");
  });
});
