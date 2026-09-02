"use client";

import { requestUserDeletion } from "@/actions/users";
import { useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { UserRoundX } from "lucide-react";
import { Spinner } from "./ui/spinner";

export function RequestUserDeletionDialog() {
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await requestUserDeletion();
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className="hover:bg-destructive/10 text-destructive hover:text-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:hover:bg-destructive/20 dark:focus-visible:ring-destructive/40"
            variant="ghost"
          >
            <UserRoundX /> Excluir conta
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir sua conta?</DialogTitle>
          <DialogDescription>
            Sua conta será desativada agora e apagada permanentemente em 30
            dias. Você pode cancelar fazendo login novamente dentro desse prazo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? (
              <>
                <Spinner /> Confirmar exclusão
              </>
            ) : (
              <>
                <UserRoundX /> Confirmar exclusão
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
