import {
  DEFAULT_CATEGORY,
  DEFAULT_CATEGORY_SLUG,
} from "@/lib/default-category";

describe("default category", () => {
  it("should expose the reserved slug", () => {
    expect(DEFAULT_CATEGORY_SLUG).toBe("sem-titulo");
  });

  it("should expose a category with a null id", () => {
    expect(DEFAULT_CATEGORY).toEqual({ id: null, name: "Sem título" });
  });
});
