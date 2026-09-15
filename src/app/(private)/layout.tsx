import { requireSession } from "@/lib/require-session";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireSession();

  return <>{children}</>;
}
