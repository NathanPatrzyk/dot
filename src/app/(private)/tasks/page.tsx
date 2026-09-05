import { LogoutButton } from "@/components/shared/logout-button";
import WeatherWidget from "@/components/shared/weather-widget";
import { TaskContainer } from "@/components/tasks/task-container";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/require-session";
import { getTasks } from "@/queries/tasks";
import { UserRoundX } from "lucide-react";

export default async function Tasks() {
  const { user } = await requireSession();
  const tasks = await getTasks(user.id);

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

      <TaskContainer tasks={tasks} />
    </div>
  );
}
