import {
  CreateCategoryInput,
  DEFAULT_CATEGORY_SLUG,
  getCategorySlug,
} from "@/core/entities/category";
import { CategoryRepository } from "@/core/ports/category-repository.port";

export function createCategoryService(categoryRepository: CategoryRepository) {
  async function getCategories(userId: string) {
    return categoryRepository.findAllByUser(userId);
  }

  async function createCategory(input: CreateCategoryInput, userId: string) {
    if (getCategorySlug(input.name) === DEFAULT_CATEGORY_SLUG) {
      throw new Error("Esse nome de categoria não pode ser utilizado.");
    }

    const existing = await categoryRepository.findByName(input.name, userId);

    if (existing) {
      throw new Error("Já existe uma categoria com esse nome.");
    }

    return categoryRepository.create(input, userId);
  }

  async function deleteCategory(id: number, userId: string) {
    const category = await categoryRepository.findById(id, userId);

    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    await categoryRepository.update(id, userId, { deletedAt: new Date() });
  }

  return { getCategories, createCategory, deleteCategory };
}
