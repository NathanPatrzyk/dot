"use client";

import { getSlug } from "@/lib/slug";
import { CategoryViewOrDefault } from "@/types/categories";
import Link from "next/link";

type CategoryCardProps = {
  category: CategoryViewOrDefault;
};

export function CategoryCard({ category }: CategoryCardProps) {
  function getHref() {
    if (category.id === null) {
      return "/categories/sem-titulo/tasks";
    } else {
      return `/categories/${getSlug(category.name)}/tasks`;
    }
  }

  return (
    <Link
      className="relative flex size-36 shrink-0 flex-col rounded-xl bg-neutral-800 px-2 pb-4 pt-3 text-background transition hover:-translate-y-1"
      href={getHref()}
    >
      <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-t-xs bg-background" />
      <span className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
        <span className="relative flex h-8 shrink-0 items-center justify-center bg-green-600">
          <span className="w-full truncate p-2 text-center font-semibold">
            dot
          </span>
        </span>
        <span className="flex flex-col flex-1 px-2 bg-green-500 items-center justify-center font-semibold text-center">
          {category.name}
        </span>
      </span>
      <span className="absolute bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 bg-background [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </Link>
  );
}
