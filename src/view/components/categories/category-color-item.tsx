"use client";

import { CategoryColor } from "@/core/entities/category";

const COLOR_CLASSES: Record<CategoryColor, string> = {
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

type CategoryColorItemProps = {
  color: CategoryColor;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

export function CategoryColorItem({
  color,
  isSelected,
  onSelect,
  disabled,
}: Readonly<CategoryColorItemProps>) {
  return (
    <button
      type="button"
      aria-label={`Cor ${color}`}
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={onSelect}
      className={`${COLOR_CLASSES[color]} flex items-center justify-center rounded-full size-6`}
    >
      {isSelected && (
        <span className="size-4.5 rounded-full border-4 border-background" />
      )}
    </button>
  );
}
