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
vi.mock("@/adapters", () => ({ getAuthProvider: vi.fn() }));

import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { getAuthProvider } from "@/adapters";

function mockAuthSession(status: "active" | "pending_deletion") {
  vi.mocked(getAuthProvider).mockReturnValue({
    getSession: vi.fn(async () => ({
      user: { id: "john-doe", name: "John Doe", email: "john@doe.dev", status, deletionRequestedAt: null },
      expiresAt: new Date("2026-04-15T12:00:00.000Z"),
    })),
  });
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
      expect(getAuthProvider).not.toHaveBeenCalled();
    },
  );

  it("should redirect to /login when the session cookie is missing", async () => {
    const response = await proxy(request("/categories"));

    expect(response).toEqual({
      __type: "redirect",
      url: "http://localhost:3000/login",
    });
    expect(getAuthProvider).not.toHaveBeenCalled();
  });

  it("should redirect a pending-deletion user to /reactivate-user", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-id");
    mockAuthSession("pending_deletion");

    const response = await proxy(request("/categories"));

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
      url: "http://localhost:3000/categories",
    });
  });

  it("should let an active session through on a private route", async () => {
    vi.mocked(getSessionCookie).mockReturnValue("session-id");
    mockAuthSession("active");

    const response = await proxy(request("/categories"));

    expect(response).toEqual({ __type: "next" });
  });
});
