import type {
  Category,
  CategoryView,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/core/entities/category";

export interface CategoryRepository {
  findById(id: number, userId: string): Promise<CategoryView | null>;

  findBySlug(slug: string, userId: string): Promise<CategoryView | null>;

  findAllByUser(userId: string): Promise<CategoryView[]>;

  create(input: CreateCategoryInput, userId: string): Promise<Category>;

  update(
    id: number,
    userId: string,
    input: UpdateCategoryInput,
  ): Promise<void>;
}
