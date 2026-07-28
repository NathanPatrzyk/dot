import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const taskInsertSchema = createInsertSchema(tasks, {
  name: (schema) => schema.min(1).max(255),
}).omit({ id: true, isCompleted: true, createdAt: true, deletedAt: true });

export const taskUpdateSchema = createUpdateSchema(tasks, {
  name: (schema) => schema.min(1).max(255),
  deletedAt: (schema) =>
    schema.refine(
      (date) => date === null || date.getTime() <= Date.now() + 5000,
      {
        message: "A data de exclusão não pode ser no futuro.",
      },
    ),
})
  .omit({ id: true, createdAt: true })
  .partial();

export const taskSelectSchema = createSelectSchema(tasks);
