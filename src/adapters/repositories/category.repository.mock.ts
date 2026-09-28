import type {
  Category,
  CategoryView,
  CreateCategoryInput,
} from "@/core/entities/category";
import type { CategoryRepository } from "@/core/ports/category-repository.port";

export function createMockedCategoryRepository(
  overrides: Partial<CategoryRepository> = {},
): CategoryRepository {
  return {
    findById: vi.fn(async (): Promise<CategoryView | null> => null),
    findByName: vi.fn(async (): Promise<CategoryView | null> => null),
    findAllByUser: vi.fn(async (): Promise<CategoryView[]> => []),
    create: vi.fn(
      async (input: CreateCategoryInput): Promise<Category> => ({
        id: 1,
        name: input.name,
        createdAt: new Date("2026-03-15T12:00:00.000Z"),
        deletedAt: null,
        userId: "john-doe",
      }),
    ),
    update: vi.fn(async (): Promise<void> => undefined),
    ...overrides,
  };
}
