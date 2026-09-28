vi.mock("@/adapters/auth/session", () => ({ requireSession: vi.fn() }));
vi.mock("@/view/components/layout/header", () => ({
  Header: ({ title }: { title: string }) => <p>navbar:{title}</p>,
}));
vi.mock("@/view/components/categories/category-container", () => ({
  CategoryContainer: ({ categories }: { categories: unknown[] }) => (
    <p>container:{categories.length}</p>
  ),
}));
vi.mock("@/adapters/queries/categories", () => ({ getCategories: vi.fn() }));

import { render, screen } from "@testing-library/react";
import Categories from "@/app/categories/page";
import { requireSession } from "@/adapters/auth/session";
import { getCategories } from "@/adapters/queries/categories";

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
