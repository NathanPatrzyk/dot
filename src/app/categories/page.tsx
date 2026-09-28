import { CategoryContainer } from "@/view/components/categories/category-container";
import { Header } from "@/view/components/layout/header";
import { requireSession } from "@/adapters/auth/session";
import { getCategories } from "@/adapters/queries/categories";

export default async function Categories() {
  const { user } = await requireSession();
  const categories = await getCategories(user.id);

  return (
    <>
      <Header title="Categorias" />
      <CategoryContainer categories={categories} />
    </>
  );
}
