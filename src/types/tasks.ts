import { taskInsertSchema, taskUpdateSchema, taskSelectSchema } from "@/db";
import z from "zod";

export type CreateTaskInput = z.infer<typeof taskInsertSchema>;
export type UpdateTaskInput = z.infer<typeof taskUpdateSchema>;
export type Task = z.infer<typeof taskSelectSchema>;
