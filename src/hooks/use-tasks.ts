import { createTask, toggleTask, deleteTask } from "@/actions/tasks";
import { tasksReducer } from "@/reducers/tasks-reducer";
import { ActionState } from "@/types/action-state";
import { TaskView, CreateTaskInput } from "@/types/tasks";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

export function useTasks(tasks: TaskView[]) {
  const [optimisticTasks, dispatchOptimistic] = useOptimistic(
    tasks,
    tasksReducer,
  );
  const [isCreating, startCreateTransition] = useTransition();
  const [, startTransition] = useTransition();

  const total = optimisticTasks.length;
  const completed = optimisticTasks.filter((task) => task.isCompleted).length;
  const porcentage = total === 0 ? 0 : (completed / total) * 100;

  const pendingTasks = optimisticTasks.filter((task) => !task.isCompleted);
  const completedTasks = optimisticTasks.filter((task) => task.isCompleted);

  function handleCreate(formData: FormData) {
    const name = formData.get("name");

    if (typeof name !== "string" || name.trim().length === 0) {
      return;
    }

    startCreateTransition(async () => {
      dispatchOptimistic({
        type: "create",
        task: { id: -Date.now(), name, isCompleted: false },
      });

      const result = await createTask(initialActionState, formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleToggle(id: number, name: string, value: boolean) {
    startTransition(async () => {
      dispatchOptimistic({ type: "toggle", id });

      try {
        await toggleTask(id);

        toast.success(`${name} ${value ? "concluída" : "reaberta"}.`);
      } catch {
        toast.error("Não foi possível atualizar tarefa.");
      }
    });
  }

  function handleDelete(id: number, name: string) {
    startTransition(async () => {
      dispatchOptimistic({ type: "delete", id });

      try {
        await deleteTask(id);

        toast.success(`${name} excluída.`);
      } catch {
        toast.error("Não foi possível excluir tarefa.");
      }
    });
  }

  return {
    allTasks: optimisticTasks,
    pendingTasks,
    completedTasks,
    total,
    completed,
    porcentage,
    isCreating,
    handleCreate,
    handleToggle,
    handleDelete,
  };
}

const initialActionState: ActionState<CreateTaskInput> = {
  success: false,
  message: "",
};
