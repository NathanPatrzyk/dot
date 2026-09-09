"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TaskFormProps = {
  action: (formData: FormData) => void;
};

export function TaskForm({ action }: TaskFormProps) {
  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    action(formData);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input name="name" placeholder="Nova tarefa" />
      <Button type="submit" className="transition-all duration-200">
        <PlusIcon /> Criar
      </Button>
    </form>
  );
}
