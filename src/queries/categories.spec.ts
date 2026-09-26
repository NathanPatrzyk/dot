import { createMockedCategoriesRepository } from "@/adapters/shared/categories.repository.mock";

vi.mock("@/adapters", () => ({
  getCategoriesRepository: vi.fn(),
}));

import { getCategoriesRepository } from "@/adapters";
import { getCategories } from "@/queries/categories";

describe("getCategories query", () => {
  it("should return the categories for the given user", async () => {
    const repository = createMockedCategoriesRepository({
      findAllByUser: vi.fn(async () => [
        { id: 2, name: "Estudos" },
        { id: 1, name: "Casa" },
      ]),
    });
    vi.mocked(getCategoriesRepository).mockReturnValue(repository);

    const categories = await getCategories("john-doe");

    expect(categories).toEqual([
      { id: 2, name: "Estudos" },
      { id: 1, name: "Casa" },
    ]);
    expect(repository.findAllByUser).toHaveBeenCalledWith("john-doe");
  });
});
