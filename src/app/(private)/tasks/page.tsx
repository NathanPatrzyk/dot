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
import { LayoutList, ListChecks, ListTodo, UserRoundX } from "lucide-react";
import { TaskList } from "@/components/task-list";
import { requireSession } from "@/lib/require-session";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default async function Tasks() {
  const { user } = await requireSession();

  const { allTasks, porcentage, completed, total } = await getAllTasks(user.id);
  const { pendingTasks } = await getPendingTasks(user.id);
  const { completedTasks } = await getCompletedTasks(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex sm:flex-row justify-between sm:h-36 h-auto gap-4 flex-col-reverse">
        <div className="w-full">
          <div className="flex justify-between w-full sm:items-center items-start sm:flex-row flex-col gap-2">
            <p>Bem-vindo, {user.name}</p>
            <div className="flex gap-1">
              <LogoutButton />
              <Button
                className="hover:bg-destructive/10 text-destructive hover:text-destructive focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:hover:bg-destructive/20 dark:focus-visible:ring-destructive/40"
                variant="ghost"
              >
                <UserRoundX /> Excluir conta
              </Button>
            </div>
          </div>
          <h2 className="text-3xl pt-8">
            <span className="font-semibold">dot</span> • Tarefas
          </h2>
        </div>
        <div>
          <WeatherWidget />
        </div>
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
