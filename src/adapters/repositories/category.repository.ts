import { CategoryRepository } from "@/core/ports/category-repository.port";
import { GetDb } from "./database.type";
import {
  Category,
  CategoryColor,
  CategoryView,
  CreateCategoryInput,
  DEFAULT_CATEGORY_COLOR,
  getSlug,
  UpdateCategoryInput,
} from "@/core/entities/category";
import { and, desc, eq, isNull } from "drizzle-orm";
import { categories } from "@/adapters/db/schema";

function toCategoryView(row: {
  id: number;
  name: string;
  color: string | null;
}): CategoryView {
  return {
    id: row.id,
    name: row.name,
    color: (row.color ?? DEFAULT_CATEGORY_COLOR) as CategoryColor,
  };
}

function toCategory(row: {
  id: number;
  name: string;
  color: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  userId: string;
}): Category {
  return {
    id: row.id,
    name: row.name,
    color: (row.color ?? DEFAULT_CATEGORY_COLOR) as CategoryColor,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    userId: row.userId,
  };
}

export function createCategoryRepository(getDb: GetDb): CategoryRepository {
  async function findById(id: number, userId: string) {
    const db = getDb();

    const category = await db.query.categories.findFirst({
      where: and(eq(categories.id, id), eq(categories.userId, userId)),
      columns: { id: true, name: true, color: true },
    });

    return category ? toCategoryView(category) : null;
  }

  async function findBySlug(slug: string, userId: string) {
    const db = getDb();

    const category = await db.query.categories.findFirst({
      where: and(eq(categories.userId, userId), eq(categories.slug, slug)),
      columns: { id: true, name: true, color: true },
    });

    return category ? toCategoryView(category) : null;
  }

  async function findAllByUser(userId: string) {
    const db = getDb();

    const results = await db.query.categories.findMany({
      where: and(eq(categories.userId, userId), isNull(categories.deletedAt)),
      columns: { id: true, name: true, color: true },
      orderBy: desc(categories.id),
    });

    return results.map(toCategoryView);
  }

  async function create(input: CreateCategoryInput, userId: string) {
    const db = getDb();
    const slug = getSlug(input.name);
    const color = input.color ?? DEFAULT_CATEGORY_COLOR;

    const [category] = await db
      .insert(categories)
      .values({ ...input, userId, slug, color })
      .returning();

    return toCategory(category);
  }

  async function update(
    id: number,
    userId: string,
    input: UpdateCategoryInput,
  ) {
    const db = getDb();

    const updateData: typeof input & { slug?: string; color?: string } = {
      ...input,
    };

    if (input.name) {
      updateData.slug = getSlug(input.name);
    }

    if (input.color) {
      updateData.color = input.color;
    }

    await db
      .update(categories)
      .set(updateData)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
  }

  return { findById, findBySlug, findAllByUser, create, update };
}
