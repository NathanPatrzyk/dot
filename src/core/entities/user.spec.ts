import { userSchema, userStatusSchema } from "./user";

describe("userStatusSchema", () => {
  it("should accept the account statuses", () => {
    expect(userStatusSchema.parse("active")).toBe("active");
    expect(userStatusSchema.parse("pending_deletion")).toBe("pending_deletion");
  });

  it("should reject an unknown status", () => {
    expect(userStatusSchema.safeParse("archived").success).toBe(false);
  });
});

describe("userSchema", () => {
  it("should parse a persisted user", () => {
    const user = {
      id: "john-doe",
      name: "John Doe",
      email: "john@doe.dev",
      emailVerified: true,
      image: null,
      status: "active",
      deletionRequestedAt: null,
      createdAt: new Date("2026-03-15T12:00:00.000Z"),
      updatedAt: new Date("2026-03-15T12:00:00.000Z"),
    };

    expect(userSchema.parse(user)).toEqual(user);
  });
});
