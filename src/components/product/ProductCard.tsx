import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarGlyph } from "@/components/brand/Stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { COUNTRIES, categoryLabel } from "@/lib/constants";
import { formatDA, timeAgo } from "@/lib/format";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index = 0,
  className,
}: {
  product: Product;
  index?: number;
  className?: string;
}) {
  const { addToCart } = useStore();
  const { toast } = useToast();

  const sold = product.status === "SOLD";
  const reserved = product.status === "RESERVED";
  const country = COUNTRIES[product.country];

  const handleAdd = () => {
    const result = addToCart(product.id);
    toast({
      title: result.message,
      description: result.ok ? product.title : undefined,
      tone: result.ok ? "success" : "error",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[28px] border border-border/70 bg-white p-3 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift",
        className,
      )}
    >
      <Link
        to={`/produit/${product.id}`}
        className="relative block overflow-hidden rounded-[22px] bg-cream-200"
        aria-label={product.title}
      >
        <div className="aspect-[4/5] w-full overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]",
                sold && "grayscale-[35%]",
              )}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-brand-300">
              <Sparkles className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* top badges */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge variant="gold" className="shadow-soft">
            <StarGlyph className="h-2.5 w-2.5" />
            Unique Produit
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft shadow-soft backdrop-blur">
            <MiniFlag code={product.country} className="h-3 w-4" />
            {country.code}
          </span>
        </div>

        {/* new badge */}
        {Date.now() - product.createdAt < 14 * 86_400_000 && !sold ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-brand-800/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gold-300 shadow-soft backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-300" />
            New
          </span>
        ) : null}

        {/* hover action */}
        {!sold && !reserved ? (
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex items-center justify-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-xs font-bold text-brand-800 shadow-lift backdrop-blur">
              Voir le produit
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        ) : null}

        {/* sold overlay */}
        {sold ? (
          <div className="absolute inset-0 grid place-items-center bg-brand-950/35 backdrop-blur-[2px]">
            <div className="rotate-[-8deg] rounded-2xl border border-white/25 bg-brand-900/85 px-6 py-3 text-center shadow-lift">
              <p className="font-display text-2xl font-black tracking-[0.2em] text-gold-300">
                VENDU
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                Pièce unique
              </p>
            </div>
          </div>
        ) : null}

        {/* reserved overlay */}
        {reserved ? (
          <div className="absolute inset-0 grid place-items-center bg-brand-950/25 backdrop-blur-[2px]">
            <div className="rounded-2xl border border-white/25 bg-white/95 px-5 py-2.5 text-center shadow-lift">
              <p className="font-display text-lg font-black tracking-[0.16em] text-brand-800">
                RÉSERVÉ
              </p>
            </div>
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <span className="truncate">{categoryLabel(product.category)}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="truncate">{timeAgo(product.createdAt)}</span>
        </div>

        <Link to={`/produit/${product.id}`} className="mt-2">
          <h3 className="line-clamp-2 font-display text-[17px] font-bold leading-snug text-brand-900 transition-colors group-hover:text-brand-600">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-ink-soft">
            {product.condition}
          </span>
          {product.size ? (
            <span className="inline-flex items-center rounded-full border border-border/70 bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-ink-soft">
              Taille {product.size}
            </span>
          ) : null}
          {product.brand ? (
            <span className="inline-flex max-w-[9rem] items-center truncate rounded-full border border-border/70 bg-cream-100 px-2 py-0.5 text-[10px] font-bold text-ink-soft">
              {product.brand}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <div>
            <p className="font-display text-lg font-black text-brand-900">
              {formatDA(product.price)}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-gold-700">
              <StarGlyph className="h-2.5 w-2.5" />1 seul exemplaire
            </p>
          </div>

          {sold ? (
            <Badge variant="sold" className="mb-1">
              Vendu
            </Badge>
          ) : reserved ? (
            <Badge variant="reserved" className="mb-1">
              Réservé
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="subtle"
              className="mb-0.5 shrink-0"
              onClick={handleAdd}
              aria-label={`Ajouter ${product.title} au panier`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Ajouter
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
