import { createCategory } from "@/adapters/actions/categories";
import { ActionState } from "@/view/types/action-state";
import { CategoryView, DEFAULT_CATEGORY } from "@/core/entities/category";
import { CreateTaskInput } from "@/core/entities/task";
import { useTransition } from "react";
import { toast } from "sonner";

export function useCategories(categories: CategoryView[]) {
  const [isPending, startTransition] = useTransition();

  const allCategories = [DEFAULT_CATEGORY, ...categories];

  function handleCreate(formData: FormData) {
    const name = formData.get("name");

    if (typeof name !== "string" || name.trim().length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await createCategory(initialActionState, formData);

      if (!result.success) {
        toast.error(result.message);
      }
    });
  }

  return {
    allCategories,
    isPending,
    handleCreate,
  };
}

const initialActionState: ActionState<CreateTaskInput> = {
  success: false,
  message: "",
};
