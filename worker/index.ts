import handler from "vinext/server/app-router-entry";
import { getUsersDeletionRepository } from "@/adapters";
import { createUsersDeletionService } from "@/core/services/users-deletion.service";

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
    const usersDeletionService = createUsersDeletionService(
      getUsersDeletionRepository(),
    );
    ctx.waitUntil(usersDeletionService.purgeExpiredAccounts());
  },
};
