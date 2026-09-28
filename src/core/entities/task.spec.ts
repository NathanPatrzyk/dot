import { createTaskInputSchema, updateTaskInputSchema } from "./task";

describe("createTaskInputSchema", () => {
  it("should require a name", () => {
    expect(createTaskInputSchema.safeParse({ name: "" }).error?.issues[0])
      .toMatchObject({ message: "O nome é obrigatório." });
  });

  it("should limit the name to 255 characters", () => {
    const result = createTaskInputSchema.safeParse({ name: "a".repeat(256) });

    expect(result.error?.issues[0]).toMatchObject({
      message: "O nome deve ter no máximo 255 caracteres.",
    });
  });

  it("should coerce the category id coming from the form data", () => {
    expect(createTaskInputSchema.parse({ name: "task", categoryId: "7" })).toEqual(
      { name: "task", categoryId: 7 },
    );
  });

  it("should accept a task without a category", () => {
    expect(createTaskInputSchema.parse({ name: "task" })).toEqual({
      name: "task",
    });
  });
});

describe("updateTaskInputSchema", () => {
  it("should accept a past deletion date", () => {
    const deletedAt = new Date("2026-03-15T12:00:00.000Z");

    expect(updateTaskInputSchema.safeParse({ deletedAt }).success).toBe(true);
  });

  it("should reject a deletion date in the future", () => {
    const deletedAt = new Date(Date.now() + 60000);

    expect(updateTaskInputSchema.safeParse({ deletedAt }).error?.issues[0])
      .toMatchObject({ message: "A data de exclusão não pode ser no futuro." });
  });
});
