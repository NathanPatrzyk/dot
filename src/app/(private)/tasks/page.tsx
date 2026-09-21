import { PrivateNavbar } from "@/components/shared/private-navbar";
import { TaskContainer } from "@/components/tasks/task-container";
import { requireSession } from "@/lib/require-session";
import { getTasks } from "@/queries/tasks";

export default async function Tasks() {
  const { user } = await requireSession();
  const tasks = await getTasks(user.id);

  return (
    <>
      <PrivateNavbar />
      <TaskContainer tasks={tasks} />
    </>
  );
}
