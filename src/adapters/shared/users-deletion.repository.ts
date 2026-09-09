import { GetDb } from "./types";
import { and, eq, lte } from "drizzle-orm";
import { users } from "@/db";
import { UsersDeletionRepository } from "@/core/ports/users-deletion.repository";

export function createUsersDeletionRepository(getDb: GetDb): UsersDeletionRepository {
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

  return { updateDeletionStatus, findExpiredDeletions, purge };
}
