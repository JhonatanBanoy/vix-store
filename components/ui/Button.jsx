"use client";

import { cn } from "../../lib/utils";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand/90 active:bg-brand/80 shadow-sm",
  secondary:
    "bg-ink text-white hover:bg-ink/90 active:bg-ink/80 shadow-sm",
  outline:
    "border border-line bg-paper text-ink hover:bg-bone active:bg-line/40",
  ghost: "text-ink hover:bg-bone active:bg-line/40",
  danger: "bg-danger text-white hover:bg-danger/90 active:bg-danger/80",
  deal: "bg-deal text-ink hover:bg-deal/90 active:bg-deal/80",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    />
  );
}
