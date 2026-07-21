"use client";

import { useOptimistic, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { toggleTask } from "@/actions/tasks";
import { toast } from "sonner";

type TaskItemProps = {
  id: number;
  name: string;
  isCompleted: boolean;
};

export function TaskItem({ id, name, isCompleted }: TaskItemProps) {
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

  return (
    <Field orientation="horizontal">
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
    </Field>
  );
}
