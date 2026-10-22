import { cn } from "../../lib/utils";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-line/70", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-paper">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
