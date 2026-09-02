"use server";

import { getDb, users } from "@/db";
import { UpdateUserInput } from "@/types/users";
import { requireSession } from "@/lib/require-session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function requestUserDeletion() {
  const { user } = await requireSession();

  const data: UpdateUserInput = {
    status: "pending_deletion",
    deletionRequestedAt: new Date(),
  };

  await getDb().update(users).set(data).where(eq(users.id, user.id));

  redirect("/login");
}
