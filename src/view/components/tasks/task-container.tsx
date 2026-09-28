"use client";

import { useTasks } from "@/view/hooks/use-tasks";
import { TaskView } from "@/core/entities/task";
import { ListTodo, LayoutList, ListChecks } from "lucide-react";
import { TabsTrigger, TabsContent, Tabs, TabsList } from "@/view/components/ui/tabs";
import { TaskForm } from "@/view/components/tasks/task-form";
import { TaskList } from "@/view/components/tasks/task-list";
import { DotContainer } from "../dot/dot-container";

type TaskContainerProps = {
  tasks: TaskView[];
  categoryId: number | null;
};

export function TaskContainer({
  tasks,
  categoryId,
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

      <DotContainer pending={pending} completed={completed} />

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
            onToggle={handleToggle}
            onDelete={handleDelete}
            loadingToggleId={loadingToggleId}
            loadingDeleteId={loadingDeleteId}
          />
        </TabsContent>

        <TabsContent value="pending">
          <TaskList
            tasks={pendingTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            loadingToggleId={loadingToggleId}
            loadingDeleteId={loadingDeleteId}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList
            tasks={completedTasks}
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
