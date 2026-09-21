import { CategoryContainer } from "@/components/categories/category-container";
import { PrivateNavbar } from "@/components/shared/private-navbar";
import { requireSession } from "@/lib/require-session";
import { getCategories } from "@/queries/categories";

export default async function Categories() {
  const { user } = await requireSession();
  const categories = await getCategories(user.id);

  return (
    <>
      <PrivateNavbar />
      <CategoryContainer categories={categories} />
    </>
  );
}
