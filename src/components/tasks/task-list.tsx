"use client";

import { Task } from "@/types/tasks";
import { useOptimistic } from "react";
import { FieldGroup } from "../ui/field";
import { TaskItem } from "./task-item";

type TaskListProps = {
  tasks: Task[];
};

export function TaskList({ tasks }: TaskListProps) {
  const [optimisticTasks, removeTaskOptimistically] = useOptimistic(
    tasks,
    (state, id: number) => state.filter((task) => task.id !== id),
  );

  return (
    <FieldGroup>
      {optimisticTasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          name={task.name}
          isCompleted={task.isCompleted}
          onDelete={() => removeTaskOptimistically(task.id)}
        />
      ))}
    </FieldGroup>
  );
}
