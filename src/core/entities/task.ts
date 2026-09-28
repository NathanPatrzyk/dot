import { z } from "zod";

export const taskSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  isCompleted: z.boolean(),
  categoryId: z.number().nullable(),
  userId: z.string(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Task = z.infer<typeof taskSchema>;

export const createTaskInputSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
  categoryId: z.coerce.number().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
  name: z
    .string()
    .min(1, "O nome é obrigatório.")
    .max(255, "O nome deve ter no máximo 255 caracteres.")
    .optional(),
  isCompleted: z.boolean().optional(),
  categoryId: z.number().nullable().optional(),
  deletedAt: z
    .date()
    .refine((date) => date.getTime() <= Date.now() + 5000, {
      message: "A data de exclusão não pode ser no futuro.",
    })
    .nullable()
    .optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export type TaskView = Omit<Task, "createdAt" | "deletedAt" | "userId">;
