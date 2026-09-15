"use client";

import clsx from "clsx";

type DotItemProps = {
  className: string;
};

export function DotItem({ className }: Readonly<DotItemProps>) {
  return (
    <div
      className={clsx("h-4 w-4 rounded-full bg-green-500", className)}
    ></div>
  );
}
