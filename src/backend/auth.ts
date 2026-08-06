import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import { accounts, sessions, users, verifications } from "../db/schema";
import type { Env } from "./env";

export function createAuth(env: Env) {
  const db = getDb(env.DB);
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "partner",
          input: false,
        },
        status: {
          type: "string",
          defaultValue: "pending",
          input: false,
        },
      },
    },
    trustedOrigins: [env.BETTER_AUTH_URL].filter(Boolean),
  });
}

export type Auth = ReturnType<typeof createAuth>;
