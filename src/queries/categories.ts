import { getCategoriesRepository } from "@/adapters";
import { createCategoriesService } from "@/core/services/categories.service";

export async function getCategories(userId: string) {
  const categoriesService = createCategoriesService(getCategoriesRepository());

  return categoriesService.getCategories(userId);
}
