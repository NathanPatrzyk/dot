import {
  createCategoryInputSchema,
  DEFAULT_CATEGORY,
  DEFAULT_CATEGORY_SLUG,
  getSlug,
  updateCategoryInputSchema,
} from "@/core/entities/category";

describe("createCategoryInputSchema", () => {
  it("should require a name", () => {
    expect(
      createCategoryInputSchema.safeParse({ name: "" }).error?.issues[0],
    ).toMatchObject({ message: "O nome é obrigatório." });
  });
});

describe("updateCategoryInputSchema", () => {
  it("should reject a deletion date in the future", () => {
    const result = updateCategoryInputSchema.safeParse({
      deletedAt: new Date(Date.now() + 60000),
    });

    expect(result.error?.issues[0]).toMatchObject({
      message: "A data de exclusão não pode ser no futuro.",
    });
  });

  it("should accept a past deletion date", () => {
    const result = updateCategoryInputSchema.safeParse({
      deletedAt: new Date("2026-03-15T12:00:00.000Z"),
    });

    expect(result.success).toBe(true);
  });
});

describe("default category", () => {
  it("should expose the reserved slug", () => {
    expect(DEFAULT_CATEGORY_SLUG).toBe("sem-titulo");
  });

  it("should expose a category with a null id", () => {
    expect(DEFAULT_CATEGORY).toEqual({ id: null, name: "Sem título" });
  });
});

describe("getCategorySlug", () => {
  it("should lowercase the value", () => {
    expect(getSlug("Casa")).toBe("casa");
  });

  it("should turn spaces into hyphens", () => {
    expect(getSlug("Minha Categoria")).toBe("minha-categoria");
  });

  it("should strip accents", () => {
    expect(getSlug("Vídeo Aulas")).toBe("video-aulas");
  });

  it("should strip non-alphanumeric characters", () => {
    expect(getSlug("Estudos & Lazer")).toBe("estudos-lazer");
    expect(getSlug("Trava-língua")).toBe("trava-lingua");
  });

  it("should keep numbers", () => {
    expect(getSlug("casa 123")).toBe("casa-123");
  });

  it("should collapse edge whitespace", () => {
    expect(getSlug("  Casa  ")).toBe("casa");
  });

  it("should slugify the reserved title", () => {
    expect(getSlug("Sem Titulo")).toBe("sem-titulo");
    expect(getSlug("Sem título")).toBe("sem-titulo");
  });

  it("should throw for non-string input", () => {
    expect(() => getSlug(123 as never)).toThrow();
  });
});
