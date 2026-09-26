"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type CategoryFormDialogProps = {
  isPending: boolean;
  action: (formData: FormData) => void;
};

export function CategoryFormDialog({
  isPending,
  action,
}: CategoryFormDialogProps) {
  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    action(formData);
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="relative flex size-36 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-800 px-2 pb-4 pt-3 text-neutral-300 transition hover:-translate-y-1"
          >
            <div className="rounded-full bg-neutral-900 p-1">
              <Plus className="size-6" />
            </div>
            <span className="text-sm font-semibold">Nova categoria</span>
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Dê um nome para a nova categoria.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            name="name"
            placeholder="Nome da categoria"
            disabled={isPending}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancelar</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : <Plus />} Criar categoria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
