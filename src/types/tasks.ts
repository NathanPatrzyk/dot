import { taskInsertSchema, taskUpdateSchema } from "@/db";
import z from "zod";

export type CreateTaskInput = z.infer<typeof taskInsertSchema>;
export type UpdateTaskInput = z.infer<typeof taskUpdateSchema>;
