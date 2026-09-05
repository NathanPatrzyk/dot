"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "@/actions/tasks";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const initialState = {
  success: false,
  message: "",
};

export function TaskForm() {
  const [state, formAction, pending] = useActionState(createTask, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="flex gap-2">
      <Input name="name" placeholder="Nova tarefa" />
      <Button
        type="submit"
        disabled={pending}
        className="transition-all duration-200"
      >
        {pending ? (
          <>
            <Spinner /> Criar
          </>
        ) : (
          <>
            <PlusIcon /> Criar
          </>
        )}
      </Button>
    </form>
  );
}
