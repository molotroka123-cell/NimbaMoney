"use client";

import React from "react";
import { classNames } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type Size = "xs" | "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm",
  secondary:
    "border border-line bg-white text-ink-secondary hover:border-brand-400 hover:text-brand-700 dark:border-night-lineStrong dark:bg-night-raised dark:text-[#CBDDD4] dark:hover:text-brand-200",
  ghost:
    "text-ink-secondary hover:bg-surface-sunken hover:text-ink dark:text-[#B7C9C0] dark:hover:bg-night-raised",
  danger: "bg-danger text-white hover:bg-red-700",
  dark: "bg-brand-900 text-white hover:bg-brand-800",
};

const sizes: Record<Size, string> = {
  xs: "px-2.5 py-1 text-xs rounded-md gap-1",
  sm: "px-3 py-1.5 text-xs rounded-control gap-1.5",
  md: "px-4 py-2 text-sm rounded-control gap-2",
  lg: "px-5 py-2.5 text-sm rounded-control gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  full,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        full && "w-full",
        className
      )}
      {...props}
    />
  );
}
