import { getSlug } from "@/lib/slug";

describe("getSlug", () => {
  it("should lowercase the value", () => {
    expect(getSlug("Casa")).toBe("casa");
  });

  it("should turn spaces into hyphens", () => {
    expect(getSlug("Minha Categoria")).toBe("minha-categoria");
  });

  it("should strip accents", () => {
    expect(getSlug("Vídeo Aulas")).toBe("vdeo-aulas");
  });

  it("should strip non-alphanumeric characters", () => {
    expect(getSlug("Estudos & Lazer")).toBe("estudos-lazer");
    expect(getSlug("Trava-língua")).toBe("trava-lngua");
  });

  it("should keep numbers", () => {
    expect(getSlug("casa 123")).toBe("casa-123");
  });

  it("should collapse edge whitespace", () => {
    expect(getSlug("  Casa  ")).toBe("casa");
  });

  it("should slugify the reserved title", () => {
    expect(getSlug("Sem Titulo")).toBe("sem-titulo");
    expect(getSlug("Sem título")).toBe("sem-ttulo");
  });

  it("should throw for non-string input", () => {
    expect(() => getSlug(123 as never)).toThrow();
  });
});
