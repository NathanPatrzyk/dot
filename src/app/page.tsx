import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  redirect(session ? "/tasks" : "/login");
}