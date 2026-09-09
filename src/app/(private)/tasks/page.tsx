import { LogoutButton } from "@/components/shared/logout-button";
import { RequestUserDeletionDialog } from "@/components/shared/request-user-deletion-dialog";
import WeatherWidget from "@/components/shared/weather-widget";
import { TaskContainer } from "@/components/tasks/task-container";
import { requireSession } from "@/lib/require-session";
import { getTasks } from "@/queries/tasks";

export default async function Tasks() {
  const { user } = await requireSession();
  const tasks = await getTasks(user.id);

  const isHomelab = Boolean(process.env.DATABASE_URL);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex sm:flex-row justify-between sm:h-36 h-auto gap-4 flex-col-reverse">
        <div className="w-full">
          <div className="flex justify-between w-full sm:items-center items-start sm:flex-row flex-col gap-2">
            <p>Bem-vindo, {user.name}</p>
            <div className="flex gap-1">
              <LogoutButton />
              {!isHomelab && <RequestUserDeletionDialog />}
            </div>
          </div>
          <h2 className="text-3xl pt-8">
            <span className="font-semibold">dot</span> • Tarefas
          </h2>
        </div>
        <div>
          {process.env.OPENWEATHER_ENABLED === "true" && <WeatherWidget />}
        </div>
      </div>

      <TaskContainer tasks={tasks} />
    </div>
  );
}
