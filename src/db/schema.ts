import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  isCompleted: integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const taskSelectSchema = createSelectSchema(tasks);

export const taskInsertSchema = createInsertSchema(tasks, {
  name: (schema) => schema.min(1).max(255),
}).omit({ id: true, isCompleted: true });

export const taskUpdateSchema = createUpdateSchema(tasks, {
  name: (schema) => schema.min(1).max(255),
})
  .omit({ id: true })
  .partial();
