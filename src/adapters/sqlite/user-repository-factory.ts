import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getDb } from "./client";
import { CommonUserRepository } from "@/core/ports/common-user-repository";

export function createSqliteUserRepository(): CommonUserRepository {
  async function findById(id: string) {
    const db = getDb();

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { id: true, name: true, email: true },
    });

    return user ?? null;
  }

  return { findById };
}
