import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "./lib/auth";

const publicRoutes = ["/login", "/privacy-policy", "/terms-of-use"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const session = await getAuth().api.getSession({
    headers: request.headers,
  });

  const isPendingDeletion = session?.user.status === "pending_deletion";
  const isReactivationPage = pathname === "/reactivate-user";

  if (isPendingDeletion && !isReactivationPage) {
    return NextResponse.redirect(new URL("/reactivate-user", request.url));
  }

  if (!isPendingDeletion && isReactivationPage) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
