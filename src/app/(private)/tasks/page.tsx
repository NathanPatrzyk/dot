import {
  getAllTasks,
  getCompletedTasks,
  getPendingTasks,
} from "@/queries/tasks";
import { TaskForm } from "@/components/task-form";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import WeatherWidget from "@/components/weather-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutList, ListChecks, ListTodo } from "lucide-react";
import { TaskList } from "@/components/task-list";
import { requireSession } from "@/lib/require-session";

export default async function Tasks() {
  const { user } = await requireSession();

  const { allTasks, porcentage, completed, total } = await getAllTasks(user.id);
  const { pendingTasks } = await getPendingTasks(user.id);
  const { completedTasks } = await getCompletedTasks(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between h-36">
        <div>
          <p>Bem-vindo, {user.name}</p>
          <h2 className="text-3xl pt-8">
            <span className="font-semibold">dot</span> • Tarefas
          </h2>
        </div>
        <WeatherWidget />
      </div>

      <TaskForm />

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
          <TaskList tasks={allTasks} />
        </TabsContent>

        <TabsContent value="pending">
          <TaskList tasks={pendingTasks} />
        </TabsContent>

        <TabsContent value="completed">
          <TaskList tasks={completedTasks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
