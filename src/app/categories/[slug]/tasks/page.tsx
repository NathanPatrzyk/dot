import { Header } from "@/view/components/layout/header";
import { TaskContainer } from "@/view/components/tasks/task-container";
import { requireSession } from "@/adapters/auth/session";
import {
  DEFAULT_CATEGORY,
  DEFAULT_CATEGORY_SLUG,
  getSlug,
} from "@/core/entities/category";
import { getCategories } from "@/adapters/queries/categories";
import { getTasks } from "@/adapters/queries/tasks";
import { notFound } from "next/navigation";

type TaskProps = {
  params: Promise<{ slug: string }>;
};

export default async function Tasks({ params }: Readonly<TaskProps>) {
  const { slug } = await params;
  const { user } = await requireSession();

  const [categories, tasks] = await Promise.all([
    getCategories(user.id),
    getTasks(user.id),
  ]);

  const category =
    slug === DEFAULT_CATEGORY_SLUG
      ? DEFAULT_CATEGORY
      : categories.find((item) => getSlug(item.name) === slug);

  if (!category) {
    notFound();
  }

  const categoryTasks = tasks.filter((task) => task.categoryId === category.id);

  return (
    <>
      <Header title={category.name} />
      <TaskContainer tasks={categoryTasks} categoryId={category.id} />
    </>
  );
}
