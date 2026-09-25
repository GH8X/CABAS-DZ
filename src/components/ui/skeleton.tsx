import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-2xl bg-cream-200/80", className)}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-border/60 bg-white p-3 shadow-soft">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <Skeleton className="h-3 w-20 rounded-full" />
      <Skeleton className="h-4 w-3/4 rounded-full" />
      <Skeleton className="h-4 w-1/3 rounded-full" />
    </div>
  );
}

export { Skeleton };
