"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Spinner } from "../ui/spinner";

type TaskItemProps = {
  id: number;
  name: string;
  isCompleted: boolean;
  isToggleLoading: boolean;
  isDeleteLoading: boolean;
  onToggle: (value: boolean) => void;
  onDelete: () => void;
};

export function TaskItem({
  id,
  name,
  isCompleted,
  isToggleLoading,
  isDeleteLoading,
  onToggle,
  onDelete,
}: Readonly<TaskItemProps>) {
  const isLoading = isToggleLoading || isDeleteLoading;

  return (
    <Field orientation="horizontal" className="group min-w-0">
      <Checkbox
        id={`task-${id}`}
        name={`task-${id}`}
        disabled={isLoading}
        className="py-2 cursor-pointer shrink-0 aria-invalid:aria-checked:border-green-500 data-checked:border-green-500 data-checked:bg-green-500 data-checked:text-white dark:data-checked:bg-green-500"
        checked={isCompleted}
        onCheckedChange={(value) => onToggle(value === true)}
      />
      <FieldLabel
        htmlFor={`task-${id}`}
        className={cn(
          isCompleted && "text-muted-foreground",
          "py-2 cursor-pointer flex-1 min-w-0",
        )}
      >
        <span className={cn("truncate", isCompleted && "line-through")}>
          {name}
        </span>
      </FieldLabel>
      <Button
        size="icon"
        variant="ghost"
        disabled={isLoading}
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        {isDeleteLoading ? (
          <Spinner className="size-5 animate-spin" />
        ) : (
          <X className="size-5 text-neutral-500" />
        )}
      </Button>
    </Field>
  );
}
