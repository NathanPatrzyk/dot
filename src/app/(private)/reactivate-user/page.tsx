import { ReactivateUserButton } from "@/components/reactivate-user-button";
import { requireSession } from "@/lib/require-session";

export default async function ReactivateUser() {
  const { user } = await requireSession();

  const requestedAt = new Date(user.deletionRequestedAt!);
  const deadline = new Date(requestedAt.getTime() + 2592000000);
  const daysLeft = Math.max(
  0,
  Math.ceil((deadline.getTime() - Date.now()) / 86400000),
);

  return (
    <div className="flex flex-col gap-6 items-center justify-center pt-32">
      <h2 className="text-2xl font-semibold">
        Sua conta está marcada para exclusão
      </h2>
      <p>
        Faltam {daysLeft} {daysLeft === 1 ? "dia" : "dias"} para a exclusão
        definitiva.
      </p>
      <ReactivateUserButton />
    </div>
  );
}
