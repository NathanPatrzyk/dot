"use client";

import { TaskView } from "@/core/entities/task";
import { FieldGroup } from "@/view/components/ui/field";
import { TaskItem } from "@/view/components/tasks/task-item";

type TaskListProps = {
  tasks: TaskView[];
  onToggle: (id: number, name: string, value: boolean) => void;
  onDelete: (id: number, name: string) => void;
  loadingToggleId: number | null;
  loadingDeleteId: number | null;
};

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  loadingToggleId,
  loadingDeleteId,
}: Readonly<TaskListProps>) {
  return (
    <FieldGroup>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          name={task.name}
          isCompleted={task.isCompleted}
          isToggleLoading={loadingToggleId === task.id}
          isDeleteLoading={loadingDeleteId === task.id}
          onToggle={(value) => onToggle(task.id, task.name, value)}
          onDelete={() => onDelete(task.id, task.name)}
        />
      ))}{" "}
    </FieldGroup>
  );
}
