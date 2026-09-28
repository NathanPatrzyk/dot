import { z } from "zod";

export const categorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
  userId: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const createCategoryInputSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

export const updateCategoryInputSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(255, "O nome deve ter no máximo 255 caracteres.")
    .optional(),
  deletedAt: z
    .date()
    .refine((date) => date.getTime() <= Date.now() + 5000, {
      message: "A data de exclusão não pode ser no futuro.",
    })
    .nullable()
    .optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;

export type CategoryView = Omit<Category, "createdAt" | "deletedAt" | "userId">;

export type DefaultCategory = { id: null; name: string };

export type CategoryViewOrDefault = CategoryView | DefaultCategory;

export const DEFAULT_CATEGORY_SLUG = "sem-titulo";

export const DEFAULT_CATEGORY: DefaultCategory = {
  id: null,
  name: "Sem título",
};

const slugSchema = z.string().slugify();

export function getCategorySlug(value: string) {
  return slugSchema.parse(value);
}
