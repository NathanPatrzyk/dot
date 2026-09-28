import { UserRepository } from "@/core/ports/user-repository.port";
import { GetDb } from "./database.type";
import { and, eq, lte } from "drizzle-orm";
import { users } from "@/adapters/db/schema";

export function createUserRepository(getDb: GetDb): UserRepository {
  async function findById(id: string) {
    const db = getDb();

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: { id: true, name: true, email: true },
    });

    return user ?? null;
  }

  async function updateDeletionStatus(
    id: string,
    status: "active" | "pending_deletion",
    deletionRequestedAt: Date | null,
  ) {
    const db = getDb();

    await db
      .update(users)
      .set({ status, deletionRequestedAt })
      .where(eq(users.id, id));
  }

  async function findExpiredDeletions(cutoffDate: Date) {
    const db = getDb();

    return db.query.users.findMany({
      where: and(
        eq(users.status, "pending_deletion"),
        lte(users.deletionRequestedAt, cutoffDate),
      ),
      columns: { id: true },
    });
  }

  async function purge(id: string) {
    const db = getDb();

    await db.delete(users).where(eq(users.id, id));
  }

  return { findById, updateDeletionStatus, findExpiredDeletions, purge };
}
