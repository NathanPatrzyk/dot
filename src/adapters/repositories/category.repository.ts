import { CategoryRepository } from "@/core/ports/category-repository.port";
import { GetDb } from "./database.type";
import { CreateCategoryInput, UpdateCategoryInput } from "@/core/entities/category";
import { and, desc, eq, isNull } from "drizzle-orm";
import { categories } from "@/adapters/db/schema";

export function createCategoryRepository(getDb: GetDb): CategoryRepository {
  async function findById(id: number, userId: string) {
    const db = getDb();

    const category = await db.query.categories.findFirst({
      where: and(eq(categories.id, id), eq(categories.userId, userId)),
      columns: { id: true, name: true },
    });

    return category ?? null;
  }

  async function findByName(name: string, userId: string) {
    const db = getDb();

    const category = await db.query.categories.findFirst({
      where: and(eq(categories.userId, userId), eq(categories.name, name)),
      columns: { id: true, name: true },
    });

    return category ?? null;
  }

  async function findAllByUser(userId: string) {
    const db = getDb();

    return db.query.categories.findMany({
      where: and(eq(categories.userId, userId), isNull(categories.deletedAt)),
      columns: { id: true, name: true },
      orderBy: desc(categories.id),
    });
  }

  async function create(input: CreateCategoryInput, userId: string) {
    const db = getDb();

    const [category] = await db
      .insert(categories)
      .values({ ...input, userId })
      .returning();

    return category;
  }

  async function update(
    id: number,
    userId: string,
    input: UpdateCategoryInput,
  ) {
    const db = getDb();

    await db
      .update(categories)
      .set(input)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
  }

  return { findById, findByName, findAllByUser, create, update };
}
