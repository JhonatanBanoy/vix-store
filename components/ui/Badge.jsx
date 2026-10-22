import { cn } from "../../lib/utils";

const variants = {
  new: "bg-ink text-white",
  sale: "bg-deal text-ink",
  soft: "bg-brand-soft text-brand",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  muted: "bg-bone text-muted",
};

export default function Badge({ className, variant = "soft", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variants[variant] || variants.soft,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
