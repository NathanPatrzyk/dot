import { UsersRepository } from "@/core/ports/users.repository";
import { GetDb } from "./types";
import { eq } from "drizzle-orm";
import { users } from "@/db";

export function createUsersRepository(getDb: GetDb): UsersRepository {
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
