import {
  categoryInsertSchema,
  categoryUpdateSchema,
  categorySelectSchema,
} from "@/db";
import z from "zod";

export type CreateCategoryInput = z.infer<typeof categoryInsertSchema>;
export type UpdateCategoryInput = z.infer<typeof categoryUpdateSchema>;

export type Category = z.infer<typeof categorySelectSchema>;
export type CategoryView = Omit<Category, "createdAt" | "deletedAt" | "userId">;
