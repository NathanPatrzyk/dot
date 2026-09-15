"use client";

import { DotItem } from "./dot-item";

type DotContainerProps = {
  completed: number;
  pending: number;
};

export function DotContainer({
  completed,
  pending,
}: Readonly<DotContainerProps>) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: completed }, (_, i) => (
        <DotItem key={i} className="bg-green-500"></DotItem>
      ))}
      {Array.from({ length: pending }, (_, i) => (
        <DotItem key={i} className="bg-input"></DotItem>
      ))}
    </div>
  );
}
