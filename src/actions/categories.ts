"use server";

import { getCategoriesRepository } from "@/adapters";
import { createCategoriesService } from "@/core/services/categories.service";
import { categoryInsertSchema } from "@/db";
import { requireSession } from "@/lib/require-session";
import { getSlug } from "@/lib/slug";
import { ActionState } from "@/types/action-state";
import { CreateCategoryInput } from "@/types/categories";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCategory(id: number) {
  const { user } = await requireSession();

  if (!id || typeof id !== "number") {
    throw new Error("Id inválido.");
  }

  const categoriesService = createCategoriesService(getCategoriesRepository());
  await categoriesService.deleteCategory(id, user.id);

  revalidatePath("/categories");
}

export async function createCategory(
  _: ActionState<CreateCategoryInput>,
  formData: FormData,
): Promise<ActionState<CreateCategoryInput>> {
  const { user } = await requireSession();

  if (!(formData instanceof FormData)) {
    return {
      success: false,
      message: "Dados inválidos.",
    };
  }

  const data = Object.fromEntries(formData);
  const parsed = categoryInsertSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message,
    };
  }

  const categoriesService = createCategoriesService(getCategoriesRepository());

  let category;
  try {
    category = await categoriesService.createCategory(parsed.data, user.id);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao criar categoria.",
    };
  }

  revalidatePath("/categories");
  redirect(`/categories/${getSlug(category.name)}/tasks`);
}
