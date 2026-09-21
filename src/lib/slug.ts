import * as z from "zod";

const slugSchema = z.string().slugify();

export function getSlug(value: string) {
  return slugSchema.parse(value);
}
