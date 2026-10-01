"use client";

import type { CategoryColor } from "@/core/entities/category";
import { DotItem } from "./dot-item";

const DOT_COLOR_CLASSES: Record<CategoryColor, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
};

type DotContainerProps = {
  completed: number;
  pending: number;
  color: CategoryColor;
};

export function DotContainer({
  completed,
  pending,
  color,
}: Readonly<DotContainerProps>) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: completed }, (_, i) => (
        <DotItem key={`completed-${i}`} className={DOT_COLOR_CLASSES[color]} />
      ))}
      {Array.from({ length: pending }, (_, i) => (
        <DotItem key={`pending-${i}`} className="bg-input" />
      ))}
    </div>
  );
}
