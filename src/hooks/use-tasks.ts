import { createTask, toggleTask, deleteTask } from "@/actions/tasks";
import { ActionState } from "@/types/action-state";
import { TaskView, CreateTaskInput } from "@/types/tasks";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function useTasks(tasks: TaskView[]) {
  const [, startTransition] = useTransition();
  const [loadingToggleId, setLoadingToggleId] = useState<number | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  const pendingTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  const pending = pendingTasks.length;
  const completed = completedTasks.length;

  async function handleCreate(formData: FormData) {
    const name = formData.get("name");

    if (typeof name !== "string" || name.trim().length === 0) {
      return false;
    }

    const result = await createTask(initialActionState, formData);

    if (result.success) {
      toast.success(result.message);
      return true;
    }

    toast.error(result.message);
    return false;
  }

  function handleToggle(id: number, name: string, value: boolean) {
    const toastId = toast.loading(
      value ? "Concluindo tarefa..." : "Reabrindo tarefa...",
    );
    setLoadingToggleId(id);

    startTransition(async () => {
      try {
        await toggleTask(id);
        toast.success(`${name} ${value ? "concluída" : "reaberta"}.`, {
          id: toastId,
        });
      } catch {
        toast.error("Não foi possível atualizar tarefa.", { id: toastId });
      } finally {
        setLoadingToggleId(null);
      }
    });
  }

  function handleDelete(id: number, name: string) {
    const toastId = toast.loading("Excluindo tarefa...");
    setLoadingDeleteId(id);

    startTransition(async () => {
      try {
        await deleteTask(id);
        toast.success(`${name} excluída.`, { id: toastId });
      } catch {
        toast.error("Não foi possível excluir tarefa.", { id: toastId });
      } finally {
        setLoadingDeleteId(null);
      }
    });
  }

  return {
    allTasks: tasks,
    pendingTasks,
    completedTasks,
    pending,
    completed,
    loadingToggleId,
    loadingDeleteId,
    handleCreate,
    handleToggle,
    handleDelete,
  };
}

const initialActionState: ActionState<CreateTaskInput> = {
  success: false,
  message: "",
};
