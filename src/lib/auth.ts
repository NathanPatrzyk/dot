import { getDb } from "@/adapters";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";

export function getAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema,
      usePlural: true,
    }),

    trustedOrigins: ["http://localhost:8787", "http://localhost:3000"],

    user: {
      additionalFields: {
        status: {
          type: "string",
          defaultValue: "active",
          input: false,
        },
        deletionRequestedAt: {
          type: "date",
          required: false,
          input: false,
        },
      },
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
  });
}
