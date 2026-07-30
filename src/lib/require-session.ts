import { redirect } from "next/navigation";
import { getSession } from "./get-session";

export async function requireSession(): Promise<
  NonNullable<Awaited<ReturnType<typeof getSession>>>
> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
