import { createMockedCategoriesRepository } from "@/adapters/shared/categories.repository.mock";

vi.mock("@/lib/require-session", () => ({
  requireSession: vi.fn(),
}));
vi.mock("@/adapters", () => ({
  getCategoriesRepository: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { createCategory, deleteCategory } from "@/actions/categories";
import { getCategoriesRepository } from "@/adapters";
import type { CategoriesRepository } from "@/core/ports/categories.repository";
import { requireSession } from "@/lib/require-session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

describe("createCategory action", () => {
  let repository: CategoriesRepository;

  beforeEach(() => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);
    repository = createMockedCategoriesRepository();
    vi.mocked(getCategoriesRepository).mockReturnValue(repository);
  });

  it("should return an error when the payload is not a FormData", async () => {
    const result = await createCategory(
      { success: false, message: "" },
      null as unknown as FormData,
    );

    expect(result).toEqual({ success: false, message: "Dados inválidos." });
    expect(repository.create).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("should return a validation error when the name is missing", async () => {
    const result = await createCategory(
      { success: false, message: "" },
      new FormData(),
    );

    expect(result).toEqual({
      success: false,
      message: "Invalid input: expected string, received undefined",
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should return the custom message when the name is empty", async () => {
    const formData = new FormData();
    formData.set("name", "");

    const result = await createCategory(
      { success: false, message: "" },
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "O nome é obrigatório.",
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("should create the category and redirect to its tasks page", async () => {
    const formData = new FormData();
    formData.set("name", "Minha Categoria");

    const result = await createCategory(
      { success: false, message: "" },
      formData,
    );

    expect(result).toBeUndefined();
    expect(repository.create).toHaveBeenCalledWith(
      { name: "Minha Categoria" },
      "john-doe",
    );
    expect(revalidatePath).toHaveBeenCalledWith("/categories");
    expect(redirect).toHaveBeenCalledWith("/categories/minha-categoria/tasks");
  });

  it("should return the error message when the service throws", async () => {
    repository.findByName = vi.fn(async () => ({ id: 1, name: "Casa" }));
    const formData = new FormData();
    formData.set("name", "Casa");

    const result = await createCategory(
      { success: false, message: "" },
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "Já existe uma categoria com esse nome.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should return a generic message when the service throws a non-error", async () => {
    repository.findByName = vi.fn(async () => {
      throw "boom";
    });
    const formData = new FormData();
    formData.set("name", "Casa");

    const result = await createCategory(
      { success: false, message: "" },
      formData,
    );

    expect(result).toEqual({
      success: false,
      message: "Erro ao criar categoria.",
    });
  });
});

describe("deleteCategory action", () => {
  it("should throw when the id is invalid", async () => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);

    await expect(deleteCategory(0)).rejects.toThrow("Id inválido.");
  });

  it("should soft-delete the category and revalidate the list", async () => {
    const repository = createMockedCategoriesRepository({
      findById: vi.fn(async () => ({ id: 1, name: "Casa" })),
    });
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);
    vi.mocked(getCategoriesRepository).mockReturnValue(repository);

    await deleteCategory(1);

    expect(repository.findById).toHaveBeenCalledWith(1, "john-doe");
    expect(repository.update).toHaveBeenCalledWith(1, "john-doe", {
      deletedAt: expect.any(Date),
    });
    expect(revalidatePath).toHaveBeenCalledWith("/categories");
  });

  it("should propagate errors thrown by the service", async () => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);
    vi.mocked(getCategoriesRepository).mockReturnValue(
      createMockedCategoriesRepository(),
    );

    await expect(deleteCategory(1)).rejects.toThrow(
      "Categoria não encontrada.",
    );
  });
});
