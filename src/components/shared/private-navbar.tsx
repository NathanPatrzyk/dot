import { requireSession } from "@/lib/require-session";
import { LogoutButton } from "./logout-button";
import { RequestUserDeletionDialog } from "./request-user-deletion-dialog";
import { WeatherWidget } from "./weather-widget";

type PrivateNavbarProps = {
  title: string;
};

export async function PrivateNavbar({ title }: PrivateNavbarProps) {
  const { user } = await requireSession();
  const isHomelab = Boolean(process.env.DATABASE_URL);

  return (
    <div className="flex sm:flex-row justify-between sm:h-36 h-auto gap-4 flex-col-reverse">
      <div className="w-full">
        <div className="flex justify-between w-full sm:items-center items-start sm:flex-row flex-col gap-2">
          <p>Bem-vindo, {user.name}</p>
          <div className="flex gap-1">
            <LogoutButton />
            {!isHomelab && <RequestUserDeletionDialog />}
          </div>
        </div>
        <div className="flex flex-wrap items-center sm:gap-6 gap-4 pt-8">
          <div className="flex gap-2">
            <div className="h-4 w-4 rounded-full bg-red-500 transition-colors hover:bg-red-600" />
            <div className="h-4 w-4 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600" />
            <div className="h-4 w-4 rounded-full bg-green-500 transition-colors hover:bg-green-600" />
          </div>
          <h2 className="scroll-m-20 text-3xl tracking-tight">
            <span className="font-semibold">dot</span> • {title}
          </h2>
        </div>
      </div>
      <div>
        {process.env.OPENWEATHER_ENABLED === "true" && <WeatherWidget />}
      </div>
    </div>
  );
}
