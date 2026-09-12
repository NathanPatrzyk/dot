vi.mock("@/lib/get-session", () => ({ getSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import Home from "@/app/page";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

describe("Home page", () => {
  it("should redirect to /tasks when there is a session", async () => {
    vi.mocked(getSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);

    await Home();

    expect(redirect).toHaveBeenCalledWith("/tasks");
  });

  it("should redirect to /login when there is no session", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    await Home();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
