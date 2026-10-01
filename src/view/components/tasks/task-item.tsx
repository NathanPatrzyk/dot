"use client";

import { Checkbox } from "@/view/components/ui/checkbox";
import { Field, FieldLabel } from "@/view/components/ui/field";
import { cn } from "@/view/lib/utils";
import { Button } from "@/view/components/ui/button";
import { X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import type { CategoryColor } from "@/core/entities/category";

const CHECKBOX_COLOR_CLASSES: Record<CategoryColor, string> = {
  red: "aria-invalid:aria-checked:border-red-500 data-checked:border-red-500 data-checked:bg-red-500 dark:data-checked:bg-red-500",
  orange:
    "aria-invalid:aria-checked:border-orange-500 data-checked:border-orange-500 data-checked:bg-orange-500 dark:data-checked:bg-orange-500",
  yellow:
    "aria-invalid:aria-checked:border-yellow-500 data-checked:border-yellow-500 data-checked:bg-yellow-500 dark:data-checked:bg-yellow-500",
  lime: "aria-invalid:aria-checked:border-lime-500 data-checked:border-lime-500 data-checked:bg-lime-500 dark:data-checked:bg-lime-500",
  green:
    "aria-invalid:aria-checked:border-green-500 data-checked:border-green-500 data-checked:bg-green-500 dark:data-checked:bg-green-500",
  cyan: "aria-invalid:aria-checked:border-cyan-500 data-checked:border-cyan-500 data-checked:bg-cyan-500 dark:data-checked:bg-cyan-500",
  blue: "aria-invalid:aria-checked:border-blue-500 data-checked:border-blue-500 data-checked:bg-blue-500 dark:data-checked:bg-blue-500",
  purple:
    "aria-invalid:aria-checked:border-purple-500 data-checked:border-purple-500 data-checked:bg-purple-500 dark:data-checked:bg-purple-500",
  pink: "aria-invalid:aria-checked:border-pink-500 data-checked:border-pink-500 data-checked:bg-pink-500 dark:data-checked:bg-pink-500",
};

type TaskItemProps = {
  id: number;
  name: string;
  color: CategoryColor;
  isCompleted: boolean;
  isToggleLoading: boolean;
  isDeleteLoading: boolean;
  onToggle: (value: boolean) => void;
  onDelete: () => void;
};

export function TaskItem({
  id,
  name,
  color,
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
        className={cn(
          "py-2 cursor-pointer shrink-0 data-checked:text-background",
          CHECKBOX_COLOR_CLASSES[color],
        )}
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
