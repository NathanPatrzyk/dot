import type { UserStatus } from "@/core/entities/user";

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  deletionRequestedAt: Date | null;
};

export type AuthSession = {
  user: AuthSessionUser;
  expiresAt: Date;
};

export interface AuthProvider {
  getSession(requestHeaders?: Headers): Promise<AuthSession | null>;
}
