import handler from "vinext/server/app-router-entry";
import { purgeExpiredUsers } from "../src/lib/purge-expired-users";

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
    ctx.waitUntil(purgeExpiredUsers());
  },
};
