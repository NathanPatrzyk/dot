"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Spinner } from "../ui/spinner";

type TaskFormProps = {
  action: (formData: FormData) => Promise<boolean>;
};

export function TaskForm({ action }: Readonly<TaskFormProps>) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const success = await action(formData);

      if (success) {
        form.reset();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input name="name" placeholder="Nova tarefa" disabled={isPending} />

      <Button
        type="submit"
        disabled={isPending}
        className="transition-all duration-200"
      >
        {isPending ? <Spinner /> : <Plus />} Criar
      </Button>
    </form>
  );
}
