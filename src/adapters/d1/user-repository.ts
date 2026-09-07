import { CommonUserRepository } from "@/core/ports/common-user-repository";
import { getDb } from "./client";
import { and, eq, lte } from "drizzle-orm";
import { users } from "@/db";
import { UserDeletionRepository } from "@/core/ports/user-deletion-repository";

export function createD1UserRepository(): CommonUserRepository {
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

export function createD1UserDeletionRepository(): UserDeletionRepository {
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
