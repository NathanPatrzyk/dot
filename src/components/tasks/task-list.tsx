"use client";

import { TaskView } from "@/types/tasks";
import { FieldGroup } from "@/components/ui/field";
import { TaskItem } from "@/components/tasks/task-item";

type TaskListProps = {
  tasks: TaskView[];
  onToggle: (id: number, name: string, value: boolean) => void;
  onDelete: (id: number, name: string) => void;
};

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <FieldGroup>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          name={task.name}
          isCompleted={task.isCompleted}
          onToggle={(value) => onToggle(task.id, task.name, value)}
          onDelete={() => onDelete(task.id, task.name)}
        />
      ))}
    </FieldGroup>
  );
}
