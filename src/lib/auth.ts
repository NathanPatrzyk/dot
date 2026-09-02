import { getDb } from "@/db";
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

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },

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
