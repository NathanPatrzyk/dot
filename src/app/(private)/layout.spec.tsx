vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));

import { render, screen } from "@testing-library/react";
import PrivateLayout from "@/app/(private)/layout";
import { requireSession } from "@/lib/require-session";

describe("PrivateLayout", () => {
  it("should require a session and render the children", async () => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe" },
    } as never);

    render(await PrivateLayout({ children: <p>private area</p> }));

    expect(requireSession).toHaveBeenCalled();
    expect(screen.getByText("private area")).toBeInTheDocument();
  });
});
