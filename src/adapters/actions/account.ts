"use server";

import { getAuthProvider, getUserRepository } from "@/adapters";
import { requireSession } from "@/adapters/auth/session";
import { createAuthService } from "@/core/services/auth.service";
import { redirect } from "next/navigation";

function getAuthService() {
  return createAuthService(getAuthProvider(), getUserRepository());
}

export async function requestAccountDeletion() {
  const { user } = await requireSession();

  const authService = getAuthService();
  await authService.requestAccountDeletion(user.id);

  redirect("/login");
}

export async function cancelAccountDeletion() {
  const { user } = await requireSession();

  const authService = getAuthService();
  await authService.cancelAccountDeletion(user.id);

  redirect("/categories");
}
