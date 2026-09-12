vi.mock("@/lib/get-session", () => ({ getSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { requireSession } from "@/lib/require-session";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

describe("requireSession", () => {
  it("should return the session when it exists", async () => {
    vi.mocked(getSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);

    const session = await requireSession();

    expect(session).toMatchObject({ user: { id: "john-doe" } });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("should redirect to /login when there is no session", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await requireSession();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
