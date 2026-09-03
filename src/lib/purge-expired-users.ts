import { getDb, users } from "@/db";
import { and, eq, lte } from "drizzle-orm";

export async function purgeExpiredUsers() {
  const cutoff = new Date(Date.now() - 2592000000);

  const db = getDb();

  const expiredUsers = await db.query.users.findMany({
    where: and(
      eq(users.status, "pending_deletion"),
      lte(users.deletionRequestedAt, cutoff),
    ),
    columns: { id: true },
  });

  for (const user of expiredUsers) {
    await db.delete(users).where(eq(users.id, user.id));
  }
}
