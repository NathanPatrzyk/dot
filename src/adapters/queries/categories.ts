import { getCategoryRepository } from "@/adapters";
import { createCategoryService } from "@/core/services/category.service";

export async function getCategories(userId: string) {
  const categoriesService = createCategoryService(getCategoryRepository());

  return categoriesService.getCategories(userId);
}
