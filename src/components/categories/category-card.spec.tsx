import { render, screen } from "@testing-library/react";
import { CategoryCard } from "./category-card";

describe("CategoryCard", () => {
  it("should link to the default category when the id is null", () => {
    render(<CategoryCard category={{ id: null, name: "Sem título" }} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/categories/sem-titulo/tasks",
    );
  });

  it("should link to the slugified category name", () => {
    render(<CategoryCard category={{ id: 1, name: "Casa" }} />);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/categories/casa/tasks",
    );
    expect(screen.getByText("Casa")).toBeInTheDocument();
  });
});
