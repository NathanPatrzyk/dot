import { PrivateNavbar } from "@/components/shared/private-navbar";
import { TaskContainer } from "@/components/tasks/task-container";
import { requireSession } from "@/lib/require-session";
import { getSlug } from "@/lib/slug";
import {
  DEFAULT_CATEGORY,
  DEFAULT_CATEGORY_SLUG,
} from "@/lib/default-category";
import { getCategories } from "@/queries/categories";
import { getTasks } from "@/queries/tasks";
import { notFound } from "next/navigation";

type TaskProps = {
  params: Promise<{ slug: string }>;
};

export default async function Tasks({ params }: TaskProps) {
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
      <PrivateNavbar title={category.name} />
      <TaskContainer tasks={categoryTasks} categoryId={category.id} />
    </>
  );
}
