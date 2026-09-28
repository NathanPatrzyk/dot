import { getAuth } from "@/adapters/auth/better-auth.config";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(getAuth());
