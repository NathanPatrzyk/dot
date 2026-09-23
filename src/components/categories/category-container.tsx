"use client";

import { useEffect, useState } from "react";
import { useCategories } from "@/hooks/use-categories";
import { CategoryView } from "@/types/categories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategoryCard } from "./category-card";
import { CategoryFormDialog } from "./category-form-dialog";

type CategoryContainerProps = {
  categories: CategoryView[];
};

export function CategoryContainer({
  categories,
}: Readonly<CategoryContainerProps>) {
  const [isMounted, setIsMounted] = useState(false);
  const { allCategories, isPending, handleCreate } = useCategories(categories);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-12">
      <Carousel
        opts={{
          align: "start",
        }}
        className="mx-auto w-fit max-w-[calc(round(down,100%+1rem,10rem)-1rem)]"
      >
        <CarouselContent className="-ml-4 py-2">
          <CarouselItem className="pl-4 basis-auto shrink-0 flex justify-center items-center">
            <CategoryFormDialog isPending={isPending} action={handleCreate} />
          </CarouselItem>
          {allCategories.map((category, index) => (
            <CarouselItem
              key={category.id ?? index}
              className="pl-4 basis-auto shrink-0 flex justify-center items-center"
            >
              <CategoryCard category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
