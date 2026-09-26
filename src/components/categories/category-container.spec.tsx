vi.mock("@/components/ui/carousel", () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselPrevious: () => <button type="button">Previous</button>,
  CarouselNext: () => <button type="button">Next</button>,
}));

import { render, screen, waitFor } from "@testing-library/react";
import { CategoryContainer } from "./category-container";

describe("CategoryContainer", () => {
  it("should render the form dialog and the category links", async () => {
    render(<CategoryContainer categories={[{ id: 1, name: "Casa" }]} />);

    await waitFor(() => expect(screen.getAllByRole("link")).toHaveLength(2));

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual([
      "/categories/sem-titulo/tasks",
      "/categories/casa/tasks",
    ]);
    expect(
      screen.getByRole("button", { name: /nova categoria/i }),
    ).toBeInTheDocument();
  });
});
