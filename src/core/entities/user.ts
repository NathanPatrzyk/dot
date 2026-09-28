import { z } from "zod";

export const userStatusSchema = z.enum(["active", "pending_deletion"]);

export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  status: userStatusSchema,
  deletionRequestedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export type UserView = Pick<User, "id" | "name" | "email">;
