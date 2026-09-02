import { cache } from "react";
import { getAuth } from "./auth";
import { headers } from "next/headers";

export const getSession = cache(async () => {
  return getAuth().api.getSession({
    headers: await headers(),
  });
});
