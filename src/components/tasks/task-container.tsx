"use client";

import { useTasks } from "@/hooks/use-tasks";
import { TaskView } from "@/types/tasks";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { ListTodo, LayoutList, ListChecks } from "lucide-react";
import { TabsTrigger, TabsContent, Tabs, TabsList } from "@/components/ui/tabs";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskList } from "@/components/tasks/task-list";

type TaskContainerProps = {
  tasks: TaskView[];
};

export function TaskContainer({ tasks }: TaskContainerProps) {
  const {
    allTasks,
    pendingTasks,
    completedTasks,
    total,
    completed,
    porcentage,
    handleCreate,
    handleToggle,
    handleDelete,
  } = useTasks(tasks);

  return (
    <>
      <TaskForm action={handleCreate} />

      <Progress
        value={porcentage}
        className="w-full"
        indicatorClassName="bg-green-500"
      >
        <ProgressLabel>
          {completed}/{total}
        </ProgressLabel>
        <ProgressValue />
      </Progress>

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
          />
        </TabsContent>

        <TabsContent value="pending">
          <TaskList
            tasks={pendingTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList
            tasks={completedTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
