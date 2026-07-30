import { requireSession } from "@/lib/require-session";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return <>{children}</>;
}
