import { userUpdateSchema } from "@/db";
import z from "zod";

export type UpdateUserInput = z.infer<typeof userUpdateSchema>;
