import { headers } from "next/headers";
import type {
  AuthProvider,
  AuthSession,
} from "@/core/ports/auth-provider.port";
import type { UserStatus } from "@/core/entities/user";
import { getAuth } from "./better-auth.config";

function toUserStatus(status: string): UserStatus {
  return status === "pending_deletion" ? "pending_deletion" : "active";
}

export function createAuthProvider(): AuthProvider {
  return {
    async getSession(requestHeaders?: Headers): Promise<AuthSession | null> {
      const session = await getAuth().api.getSession({
        headers: requestHeaders ?? (await headers()),
      });

      if (!session) {
        return null;
      }

      return {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          status: toUserStatus(session.user.status),
          deletionRequestedAt: session.user.deletionRequestedAt ?? null,
        },
        expiresAt: new Date(session.session.expiresAt),
      };
    },
  };
}
