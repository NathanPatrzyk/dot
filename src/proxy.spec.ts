vi.mock("next/server", () => {
  class NextRequest {
    url: string;
    nextUrl: { pathname: string };
    headers: Headers;

    constructor(url: string) {
      this.url = url;
      this.nextUrl = { pathname: new URL(url).pathname };
      this.headers = new Headers();
    }
  }

  return {
    NextRequest,
    NextResponse: {
      next: () => ({ __type: "next" }),
      redirect: (url: string | URL) => ({
        __type: "redirect",
        url: String(url),
      }),
    },
  };
});
vi.mock("better-auth/cookies", () => ({ getSessionCookie: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getAuth: vi.fn() }));

import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { getAuth } from "@/lib/auth";

function mockAuthSession(status: string) {
  vi.mocked(getAuth).mockReturnValue({
    api: { getSession: vi.fn(async () => ({ user: { status } })) },
  } as never);
}

const request = (pathname: string) =>
  new NextRequest(`http://localhost:3000${pathname}`);

describe("proxy middleware", () => {
  beforeEach(() => {
    vi.mocked(getSessionCookie).mockReturnValue(null);
  });

  it.each(["/login", "/privacy-policy", "/terms-of-use"])(
    "should let the public route %s pass through without a session",
    async (pathname) => {
      const response = await proxy(request(pathname));

      expect(response).toEqual({ __type: "next" });
      expect(getSessionCookie).not.toHaveBeenCalled();
      expect(getAuth).not.toHaveBeenCalled();
    },
  );

  it("should redirect to /login when the session cookie is missing", async () => {
    const response = await proxy(request("/tasks"));

    expect(response).toEqual({
      __type: "redirect",
      url: "http://localhost:3000/login",
    });
    expect(getAuth).not.toHaveBeenCalled();
  });

  it("should redirect a pending-deletion user to /reactivate-user", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-id");
    mockAuthSession("pending_deletion");

    const response = await proxy(request("/tasks"));

    expect(response).toEqual({
      __type: "redirect",
      url: "http://localhost:3000/reactivate-user",
    });
  });

  it("should redirect an active user away from /reactivate-user", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-id");
    mockAuthSession("active");

    const response = await proxy(request("/reactivate-user"));

    expect(response).toEqual({
      __type: "redirect",
      url: "http://localhost:3000/tasks",
    });
  });

  it("should let an active session through on a private route", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-id");
    mockAuthSession("active");

    const response = await proxy(request("/tasks"));

    expect(response).toEqual({ __type: "next" });
  });
});
