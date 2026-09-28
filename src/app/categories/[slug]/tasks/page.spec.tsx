vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
vi.mock("@/adapters/auth/session", () => ({ requireSession: vi.fn() }));
vi.mock("@/adapters/queries/tasks", () => ({ getTasks: vi.fn() }));
vi.mock("@/adapters/queries/categories", () => ({ getCategories: vi.fn() }));

const { mockHeaderProps, mockTaskContainerProps } = vi.hoisted(() => ({
  mockHeaderProps: [] as { title: string }[],
  mockTaskContainerProps: [] as {
    tasks: { id: string; categoryId: number | null }[];
    categoryId: number | null;
  }[],
}));

vi.mock("@/view/components/layout/header", () => ({
  Header: ({ title }: { title: string }) => {
    mockHeaderProps.push({ title });
    return <div data-testid="private-navbar">{title}</div>;
  },
}));

vi.mock("@/view/components/tasks/task-container", () => ({
  TaskContainer: ({
    tasks,
    categoryId,
  }: {
    tasks: { id: string; categoryId: number | null }[];
    categoryId: number | null;
  }) => {
    mockTaskContainerProps.push({ tasks, categoryId });
    return <div data-testid="task-container">{tasks.length}</div>;
  },
}));

import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { requireSession } from "@/adapters/auth/session";
import { getTasks } from "@/adapters/queries/tasks";
import { getCategories } from "@/adapters/queries/categories";
import Tasks from "@/app/categories/[slug]/tasks/page";

describe("Tasks page", () => {
  beforeEach(() => {
    vi.mocked(requireSession).mockResolvedValue({
      user: { id: "john-doe", name: "John Doe" },
    } as never);
    vi.mocked(getCategories).mockResolvedValue([
      { id: 1, name: "Casa" },
      { id: 2, name: "Trabalho" },
    ] as never);
    vi.mocked(getTasks).mockResolvedValue([
      { id: "t1", name: "Lavar a louça", isCompleted: false, categoryId: 1 },
      { id: "t2", name: "Estudar", isCompleted: true, categoryId: 1 },
      { id: "t3", name: "Reunião", isCompleted: false, categoryId: 2 },
      { id: "t4", name: "Sem categoria", isCompleted: false, categoryId: null },
    ] as never);
    vi.mocked(notFound).mockClear();
    mockHeaderProps.length = 0;
    mockTaskContainerProps.length = 0;
  });

  it("should resolve the category by slug and pass its title to the navbar", async () => {
    render(await Tasks({ params: Promise.resolve({ slug: "casa" }) }));

    expect(getCategories).toHaveBeenCalledWith("john-doe");
    expect(getTasks).toHaveBeenCalledWith("john-doe");
    expect(mockHeaderProps[0]).toEqual({ title: "Casa" });
    expect(screen.getByTestId("private-navbar")).toHaveTextContent("Casa");
  });

  it("should pass only the tasks of the matched category", async () => {
    render(await Tasks({ params: Promise.resolve({ slug: "casa" }) }));

    expect(mockTaskContainerProps[0]).toEqual({
      tasks: [
        { id: "t1", name: "Lavar a louça", isCompleted: false, categoryId: 1 },
        { id: "t2", name: "Estudar", isCompleted: true, categoryId: 1 },
      ],
      categoryId: 1,
    });
    expect(screen.getByTestId("task-container")).toHaveTextContent("2");
  });

  it("should use the default category when the slug is sem-titulo", async () => {
    render(await Tasks({ params: Promise.resolve({ slug: "sem-titulo" }) }));

    expect(mockHeaderProps[0]).toEqual({ title: "Sem título" });
    expect(mockTaskContainerProps[0]).toEqual({
      tasks: [
        {
          id: "t4",
          name: "Sem categoria",
          isCompleted: false,
          categoryId: null,
        },
      ],
      categoryId: null,
    });
    expect(screen.getByTestId("task-container")).toHaveTextContent("1");
  });

  it("should render notFound when the slug does not match any category", async () => {
    await expect(
      Tasks({ params: Promise.resolve({ slug: "inexistente" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
