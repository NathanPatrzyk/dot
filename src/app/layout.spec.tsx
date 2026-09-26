vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "mock-geist" }),
  Geist_Mono: () => ({ variable: "mock-geist-mono" }),
}));
vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

import type { ReactNode } from "react";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("should render the root structure with children", () => {
    const children = <p>content</p>;
    const tree = RootLayout({ children }) as unknown as {
      type: string;
      props: {
        lang?: string;
        className?: string;
        children?: ReactNode;
      };
    };

    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("en");
    expect(tree.props.className).toContain("antialiased");
    expect(tree.props.className).toContain("mock-geist");
    expect(tree.props.className).toContain("mock-geist-mono");

    const body = tree.props.children as unknown as {
      type: string;
      props: {
        children: [
          { type: string; props: { children?: ReactNode } },
          { type: unknown },
        ];
      };
    };
    expect(body.type).toBe("body");

    const [main, toaster] = body.props.children;

    expect(main.props.children).toBe(children);
    expect(typeof toaster.type).toBe("function");
  });
});
