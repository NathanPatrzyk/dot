"use client";

import { useOptimistic, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { deleteTask, toggleTask } from "@/actions/tasks";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type TaskItemProps = {
  id: number;
  name: string;
  isCompleted: boolean;
  onDelete?: () => void;
};

export function TaskItem({ id, name, isCompleted, onDelete }: TaskItemProps) {
  const [optimisticCompleted, setOptimisticCompleted] =
    useOptimistic(isCompleted);
  const [, startTransition] = useTransition();

  function handleCheckedChange(value: boolean) {
    startTransition(async () => {
      setOptimisticCompleted(value);

      try {
        await toggleTask(id);

        toast.success(`${name} ${value ? "concluída" : "reaberta"}.`);
      } catch {
        toast.error("Não foi possível atualizar a tarefa.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      onDelete?.();

      try {
        await deleteTask(id);

        toast.success(`${name} excluída.`);
      } catch {
        toast.error("Não foi possível excluir a tarefa.");
      }
    });
  }

  return (
    <Field orientation="horizontal" className="group">
      <Checkbox
        id={`task-${id}`}
        name={`task-${id}`}
        className="py-2 cursor-pointer aria-invalid:aria-checked:border-green-500 data-checked:border-green-500 data-checked:bg-green-500 data-checked:text-white dark:data-checked:bg-green-500"
        checked={optimisticCompleted}
        onCheckedChange={(value) => handleCheckedChange(value === true)}
      />
      <FieldLabel
        htmlFor={`task-${id}`}
        className={cn(
          optimisticCompleted && "line-through text-muted-foreground",
          "py-2 cursor-pointer",
        )}
      >
        {name}
      </FieldLabel>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="size-5 text-neutral-500" />
      </Button>
    </Field>
  );
}
