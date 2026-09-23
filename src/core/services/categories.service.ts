import { CreateCategoryInput } from "@/types/categories";
import { CategoriesRepository } from "../ports/categories.repository";
import { getSlug } from "@/lib/slug";
import { DEFAULT_CATEGORY_SLUG } from "@/lib/default-category";

export function createCategoriesService(
  categoriesRepository: CategoriesRepository,
) {
  async function getCategories(userId: string) {
    return categoriesRepository.findAllByUser(userId);
  }

  async function createCategory(input: CreateCategoryInput, userId: string) {
    if (getSlug(input.name) === DEFAULT_CATEGORY_SLUG) {
      throw new Error("Esse nome de categoria não pode ser utilizado.");
    }

    const existing = await categoriesRepository.findByName(input.name, userId);

    if (existing) {
      throw new Error("Já existe uma categoria com esse nome.");
    }

    return categoriesRepository.create(input, userId);
  }

  async function deleteCategory(id: number, userId: string) {
    const category = await categoriesRepository.findById(id, userId);

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    await categoriesRepository.update(id, userId, { deletedAt: new Date() });
  }

  return { getCategories, createCategory, deleteCategory };
}
