import { CreateCategoryInput, UpdateCategoryInput } from "@/types/categories";

export type CategoryRecord = {
  id: number;
  name: string;
};

export interface CategoriesRepository {
  findById(id: number, userId: string): Promise<CategoryRecord | null>;

  findAllByUser(userId: string): Promise<CategoryRecord[]>;

  create(input: CreateCategoryInput, userId: string): Promise<CategoryRecord>;

  update(id: number, userId: string, input: UpdateCategoryInput): Promise<void>;
}
