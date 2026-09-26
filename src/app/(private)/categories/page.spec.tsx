vi.mock("@/lib/require-session", () => ({ requireSession: vi.fn() }));
vi.mock("@/components/shared/private-navbar", () => ({
  PrivateNavbar: ({ title }: { title: string }) => <p>navbar:{title}</p>,
}));
vi.mock("@/components/categories/category-container", () => ({
  CategoryContainer: ({ categories }: { categories: unknown[] }) => (
    <p>container:{categories.length}</p>
  ),
}));
vi.mock("@/queries/categories", () => ({ getCategories: vi.fn() }));

import { render, screen } from "@testing-library/react";
import Categories from "@/app/(private)/categories/page";
import { requireSession } from "@/lib/require-session";
import { getCategories } from "@/queries/categories";

describe("Categories page", () => {
  it("should render the navbar and the category container", async () => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe", name: "John Doe" },
    } as never);
    vi.mocked(getCategories).mockResolvedValue([{ id: 1, name: "Casa" }]);

    render(await Categories());

    expect(requireSession).toHaveBeenCalled();
    expect(getCategories).toHaveBeenCalledWith("john-doe");
    expect(screen.getByText("navbar:Categorias")).toBeInTheDocument();
    expect(screen.getByText("container:1")).toBeInTheDocument();
  });
});
