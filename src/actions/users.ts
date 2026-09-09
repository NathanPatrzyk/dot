"use server";

import { requireSession } from "@/lib/require-session";
import { redirect } from "next/navigation";
import { getUsersDeletionRepository } from "@/adapters";
import { createUsersDeletionService } from "@/core/services/users-deletion.service";

export async function requestUserDeletion() {
  const { user } = await requireSession();

  const userDeletionService = createUsersDeletionService(
    getUsersDeletionRepository(),
  );
  await userDeletionService.requestDeletion(user.id);

  redirect("/login");
}

export async function cancelUserDeletion() {
  const { user } = await requireSession();

  const userDeletionService = createUsersDeletionService(
    getUsersDeletionRepository(),
  );
  await userDeletionService.cancelDeletion(user.id);

  redirect("/tasks");
}
