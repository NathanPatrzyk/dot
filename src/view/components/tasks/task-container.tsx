"use client";

import { useTasks } from "@/view/hooks/use-tasks";
import { TaskView } from "@/core/entities/task";
import type { CategoryColor } from "@/core/entities/category";
import { ListTodo, LayoutList, ListChecks } from "lucide-react";
import {
  TabsTrigger,
  TabsContent,
  Tabs,
  TabsList,
} from "@/view/components/ui/tabs";
import { TaskForm } from "@/view/components/tasks/task-form";
import { TaskList } from "@/view/components/tasks/task-list";
import { DotContainer } from "../dot/dot-container";

type TaskContainerProps = {
  tasks: TaskView[];
  categoryId: number | null;
  color: CategoryColor;
};

export function TaskContainer({
  tasks,
  categoryId,
  color,
}: Readonly<TaskContainerProps>) {
  const {
    allTasks,
    pendingTasks,
    completedTasks,
    pending,
    completed,
    loadingToggleId,
    loadingDeleteId,
    handleCreate,
    handleToggle,
    handleDelete,
  } = useTasks(tasks, categoryId);

  return (
    <>
      <TaskForm action={handleCreate} />

      <DotContainer pending={pending} completed={completed} color={color} />

      <Tabs defaultValue="all" className="flex flex-col gap-6">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="all">
            <ListTodo />
            Todas
          </TabsTrigger>
          <TabsTrigger value="pending">
            <LayoutList />
            Pendentes
          </TabsTrigger>
          <TabsTrigger value="completed">
            <ListChecks />
            Concluídas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskList
            tasks={allTasks}
            color={color}
            onToggle={handleToggle}
            onDelete={handleDelete}
            loadingToggleId={loadingToggleId}
            loadingDeleteId={loadingDeleteId}
          />
        </TabsContent>

        <TabsContent value="pending">
          <TaskList
            tasks={pendingTasks}
            color={color}
            onToggle={handleToggle}
            onDelete={handleDelete}
            loadingToggleId={loadingToggleId}
            loadingDeleteId={loadingDeleteId}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList
            tasks={completedTasks}
            color={color}
            onToggle={handleToggle}
            onDelete={handleDelete}
            loadingToggleId={loadingToggleId}
            loadingDeleteId={loadingDeleteId}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
