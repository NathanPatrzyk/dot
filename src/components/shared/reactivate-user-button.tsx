"use client";

import { cancelUserDeletion } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { UserRoundCheck } from "lucide-react";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export function ReactivateUserButton() {
  const [isPending, startTransition] = useTransition();

  function handleReactivate() {
    startTransition(async () => {
      try {
        await cancelUserDeletion();
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        toast.error("Não foi possível reativar sua conta. Tente novamente.");
      }
    });
  }

  return (
    <Button disabled={isPending} onClick={handleReactivate}>
      {isPending ? (
        <>
          <Spinner /> Reativar conta
        </>
      ) : (
        <>
          <UserRoundCheck /> Reativar conta
        </>
      )}
    </Button>
  );
}
