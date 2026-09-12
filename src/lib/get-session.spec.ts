vi.mock("@/lib/auth", () => ({ getAuth: vi.fn() }));
vi.mock("next/headers", () => ({ headers: vi.fn() }));

import { getSession } from "./get-session";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";

describe("getSession", () => {
  beforeEach(() => {
    vi.mocked(headers).mockResolvedValue(new Headers() as never);
  });

  it("should return the auth session for the current headers", async () => {
    const getSessionApi = vi.fn(async () => ({ user: { id: "john-doe" } }));
    vi.mocked(getAuth).mockReturnValue({
      api: { getSession: getSessionApi },
    } as never);

    const session = await getSession();

    expect(session).toEqual({ user: { id: "john-doe" } });
    expect(getSessionApi).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
  });

  it("should return null when there is no session", async () => {
    vi.mocked(getAuth).mockReturnValue({
      api: { getSession: vi.fn(async () => null) },
    } as never);

    await expect(getSession()).resolves.toBeNull();
  });
});
