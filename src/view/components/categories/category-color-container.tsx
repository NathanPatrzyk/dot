"use client";

import { CATEGORY_COLORS, CategoryColor } from "@/core/entities/category";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { CategoryColorItem } from "./category-color-item";

type CategoryColorContainerProps = {
  value: CategoryColor;
  onChange: (color: CategoryColor) => void;
  disabled?: boolean;
};

export function CategoryColorContainer({
  value,
  onChange,
  disabled,
}: CategoryColorContainerProps) {
  return (
    <Field>
      <FieldLabel>Cor da Categoria</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_COLORS.map((color) => (
          <CategoryColorItem
            key={color}
            color={color}
            isSelected={value === color}
            onSelect={() => !disabled && onChange(color)}
            disabled={disabled}
          />
        ))}
      </div>
      <Input type="hidden" name="color" value={value} disabled={disabled} />
    </Field>
  );
}
