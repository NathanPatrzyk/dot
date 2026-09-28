"use server";

import { getCategoryRepository } from "@/adapters";
import { requireSession } from "@/adapters/auth/session";
import {
  CreateCategoryInput,
  createCategoryInputSchema,
  getCategorySlug,
} from "@/core/entities/category";
import { createCategoryService } from "@/core/services/category.service";
import { ActionState } from "@/view/types/action-state";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteCategory(id: number) {
  const { user } = await requireSession();

  if (!id || typeof id !== "number") {
    throw new Error("Id inválido.");
  }

  const categoryService = createCategoryService(getCategoryRepository());
  await categoryService.deleteCategory(id, user.id);

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
  const parsed = createCategoryInputSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message,
    };
  }

  const categoryService = createCategoryService(getCategoryRepository());

  let category;
  try {
    category = await categoryService.createCategory(parsed.data, user.id);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao criar categoria.",
    };
  }

  revalidatePath("/categories");
  redirect(`/categories/${getCategorySlug(category.name)}/tasks`);
}
