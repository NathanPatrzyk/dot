"use client";

import {
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_SLUG,
  getSlug,
} from "@/core/entities/category";
import type {
  CategoryColor,
  CategoryViewOrDefault,
} from "@/core/entities/category";
import Link from "next/link";

const CARD_COLOR_CLASSES: Record<
  CategoryColor,
  { base: string; dark: string }
> = {
  red: { base: "bg-red-500", dark: "bg-red-600" },
  orange: { base: "bg-orange-500", dark: "bg-orange-600" },
  yellow: { base: "bg-yellow-500", dark: "bg-yellow-600" },
  lime: { base: "bg-lime-500", dark: "bg-lime-600" },
  green: { base: "bg-green-500", dark: "bg-green-600" },
  cyan: { base: "bg-cyan-500", dark: "bg-cyan-600" },
  blue: { base: "bg-blue-500", dark: "bg-blue-600" },
  purple: { base: "bg-purple-500", dark: "bg-purple-600" },
  pink: { base: "bg-pink-500", dark: "bg-pink-600" },
};

type CategoryCardProps = {
  category: CategoryViewOrDefault;
};

export function CategoryCard({ category }: Readonly<CategoryCardProps>) {
  const color = "color" in category ? category.color : DEFAULT_CATEGORY_COLOR;
  const colorClasses = CARD_COLOR_CLASSES[color];

  function getHref() {
    if (category.id === null) {
      return `/categories/${DEFAULT_CATEGORY_SLUG}/tasks`;
    }

    return `/categories/${getSlug(category.name)}/tasks`;
  }

  return (
    <Link
      className="relative flex size-36 shrink-0 flex-col rounded-xl bg-neutral-800 px-2 pb-4 pt-3 text-background transition hover:-translate-y-1"
      href={getHref()}
    >
      <span className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-t-xs bg-background" />
      <span className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
        <span
          className={`relative flex h-8 shrink-0 items-center justify-center ${colorClasses.dark}`}
        >
          <span className="w-full truncate p-2 text-center font-semibold">
            dot
          </span>
        </span>
        <span
          className={`flex flex-1 flex-col items-center justify-center px-2 text-center font-semibold ${colorClasses.base}`}
        >
          {category.name}
        </span>
      </span>
      <span className="absolute bottom-1 left-1/2 h-2 w-4 -translate-x-1/2 bg-background [clip-path:polygon(0_0,100%_0,50%_100%)]" />
    </Link>
  );
}
