import { cn } from "@/lib/utils";
import { SearchX } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { StarRow } from "@/components/brand/Stars";
import type { Product } from "@/lib/types";

export function ProductGrid({
  products,
  loading,
  className,
  emptyTitle = "Aucune pièce ne correspond",
  emptyText = "Essayez d'élargir vos filtres — nos trouvailles changent chaque semaine.",
  skeletonCount = 8,
}: {
  products: Product[];
  loading?: boolean;
  className?: string;
  emptyTitle?: string;
  emptyText?: string;
  skeletonCount?: number;
}) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-brand-200 bg-white/70 px-6 py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-500">
          <SearchX className="h-7 w-7" />
        </span>
        <StarRow className="mt-5" />
        <h3 className="mt-4 font-display text-xl font-bold text-brand-900">{emptyTitle}</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
