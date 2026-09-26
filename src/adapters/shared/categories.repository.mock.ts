import type {
  CategoriesRepository,
  CategoryRecord,
} from "@/core/ports/categories.repository";
import type { CreateCategoryInput } from "@/types/categories";

export function createMockedCategoriesRepository(
  overrides: Partial<CategoriesRepository> = {},
): CategoriesRepository {
  return {
    findById: vi.fn(async (): Promise<CategoryRecord | null> => null),
    findByName: vi.fn(async (): Promise<CategoryRecord | null> => null),
    findAllByUser: vi.fn(async (): Promise<CategoryRecord[]> => []),
    create: vi.fn(
      async (input: CreateCategoryInput): Promise<CategoryRecord> => ({
        id: 1,
        name: input.name,
      }),
    ),
    update: vi.fn(async (): Promise<void> => undefined),
    ...overrides,
  };
}
