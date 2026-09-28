import { getAuthProvider } from "@/adapters";
import type { AuthSession } from "@/core/ports/auth-provider.port";
import { redirect } from "next/navigation";
import { cache } from "react";

const getCachedSession = cache(async () => getAuthProvider().getSession());

export async function getSession(): Promise<AuthSession | null> {
  return getCachedSession();
}

export async function requireSession(): Promise<AuthSession> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
