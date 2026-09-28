import handler from "vinext/server/app-router-entry";
import { getAuthProvider, getUserRepository } from "@/adapters";
import { createAuthService } from "@/core/services/auth.service";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    return handler.fetch(request, env, ctx);
  },
  async scheduled(
    _controller: ScheduledController,
    _env: Env,
    ctx: ExecutionContext,
  ) {
    const authService = createAuthService(getAuthProvider(), getUserRepository());
    ctx.waitUntil(authService.purgeExpiredAccounts());
  },
};
