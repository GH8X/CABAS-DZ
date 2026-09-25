import { motion } from "framer-motion";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarGlyph } from "@/components/brand/Stars";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORIES,
  CONDITIONS,
  COUNTRY_LIST,
  PRICE_BOUNDS,
  SIZES,
  SORT_OPTIONS,
  type SortOption,
} from "@/lib/constants";
import { formatDA, formatNumber } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Shop() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const category = params.get("categorie") ?? "";
  const country = params.get("pays") ?? "";
  const condition = params.get("etat") ?? "";
  const brand = params.get("marque") ?? "";
  const size = params.get("taille") ?? "";
  const availability = params.get("statut") ?? "available";
  const minPrice = Number(params.get("min") ?? PRICE_BOUNDS.min);
  const maxPrice = Number(params.get("max") ?? PRICE_BOUNDS.max);
  const sort = (params.get("tri") ?? "recent") as SortOption;

  const setParam = (key: string, value: string, options?: { replace?: boolean }) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: options?.replace ?? false });
  };

  const setMany = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setParams(next, { replace: true });
  };

  const resetFilters = () => {
    const next = new URLSearchParams();
    if (availability !== "available") next.set("statut", availability);
    setParams(next, { replace: true });
  };

  const brands = useMemo(
    () =>
      Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b, "fr"),
      ),
    [products],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();

    const list = products.filter((product) => {
      if (availability === "available" && product.status !== "AVAILABLE") return false;
      if (availability === "sold" && product.status !== "SOLD") return false;
      if (availability === "reserved" && product.status !== "RESERVED") return false;
      if (category && product.category !== category) return false;
      if (country && product.country !== country) return false;
      if (condition && product.condition !== condition) return false;
      if (brand && product.brand !== brand) return false;
      if (size && product.size !== size) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      if (term) {
        const haystack = [
          product.title,
          product.brand,
          product.description,
          product.measurements ?? "",
          product.era ?? "",
          ...product.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    return sortProducts(list, sort);
  }, [
    products,
    availability,
    category,
    country,
    condition,
    brand,
    size,
    minPrice,
    maxPrice,
    q,
    sort,
  ]);

  const activeCount = [
    category,
    country,
    condition,
    brand,
    size,
    q,
    minPrice > PRICE_BOUNDS.min ? "1" : "",
    maxPrice < PRICE_BOUNDS.max ? "1" : "",
  ].filter(Boolean).length;

  const filters = (
    <div className="flex flex-col gap-6">
      <FilterBlock title="Recherche">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
          <Input
            value={q}
            onChange={(event) => setParam("q", event.target.value, { replace: true })}
            placeholder="Veste, sac, jouet…"
            className="pl-10"
          />
        </div>
      </FilterBlock>

      <FilterBlock title="Catégorie">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!category} onClick={() => setParam("categorie", "")}>
            Toutes
          </Chip>
          {CATEGORIES.map((item) => (
            <Chip
              key={item.id}
              active={category === item.id}
              onClick={() => setParam("categorie", item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </Chip>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Pays d'origine">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!country} onClick={() => setParam("pays", "")}>
            Tous
          </Chip>
          {COUNTRY_LIST.map((item) => (
            <Chip
              key={item.code}
              active={country === item.code}
              onClick={() => setParam("pays", item.code)}
            >
              <MiniFlag code={item.code} className="h-3 w-4" />
              {item.name}
            </Chip>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title={`Prix — ${formatDA(minPrice)} à ${formatDA(maxPrice)}`}>
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={500}
            value={minPrice}
            onChange={(event) =>
              setParam("min", String(Math.min(Number(event.target.value), maxPrice)), {
                replace: true,
              })
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-brand-100 accent-brand-700"
            aria-label="Prix minimum"
          />
          <input
            type="range"
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={500}
            value={maxPrice}
            onChange={(event) =>
              setParam("max", String(Math.max(Number(event.target.value), minPrice)), {
                replace: true,
              })
            }
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-brand-100 accent-brand-700"
            aria-label="Prix maximum"
          />
        </div>
      </FilterBlock>

      <FilterBlock title="État">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!condition} onClick={() => setParam("etat", "")}>
            Tous
          </Chip>
          {CONDITIONS.map((item) => (
            <Chip key={item} active={condition === item} onClick={() => setParam("etat", item)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Marque">
        <Select
          value={brand}
          onChange={(event) => setParam("marque", event.target.value)}
          placeholder="Toutes les marques"
          options={brands.map((item) => ({ value: item, label: item }))}
        />
      </FilterBlock>

      <FilterBlock title="Taille">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!size} onClick={() => setParam("taille", "")}>
            Toutes
          </Chip>
          {SIZES.map((item) => (
            <Chip key={item} active={size === item} onClick={() => setParam("taille", item)}>
              {item}
            </Chip>
          ))}
        </div>
      </FilterBlock>

      <Button variant="ghost" onClick={resetFilters} className="justify-start">
        <X className="h-4 w-4" />
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <div className="container py-10">
      <SectionHeading
        align="left"
        eyebrow="Boutique"
        title="Toutes nos trouvailles européennes"
        subtitle="Chaque produit est une pièce unique : un seul exemplaire, jamais réapprovisionné."
      />

      <div className="mt-8 flex flex-col gap-4">
        <Tabs
          value={availability}
          onValueChange={(value) => setParam("statut", value)}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto no-scrollbar sm:w-auto">
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="reserved">Réservés</TabsTrigger>
            <TabsTrigger value="sold">Vendus</TabsTrigger>
            <TabsTrigger value="all">Tout</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <StarGlyph className="h-3.5 w-3.5 text-gold-400" />
            <span className="font-display text-lg font-black text-brand-900">
              {formatNumber(filtered.length)}
            </span>
            pièce{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtres
              {activeCount > 0 ? (
                <Badge variant="gold" className="ml-1 px-1.5 py-0">
                  {activeCount}
                </Badge>
              ) : null}
            </Button>

            <Select
              value={sort}
              onChange={(event) => setParam("tri", event.target.value)}
              options={SORT_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
              wrapperClassName="w-[190px]"
            />
          </div>
        </div>

        {activeCount > 0 ? (
          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border/60 bg-white/70 p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Filtres actifs
            </span>
            {q ? <ActiveChip label={`« ${q} »`} onClear={() => setParam("q", "")} /> : null}
            {category ? (
              <ActiveChip
                label={CATEGORIES.find((item) => item.id === category)?.label ?? category}
                onClear={() => setParam("categorie", "")}
              />
            ) : null}
            {country ? (
              <ActiveChip
                label={COUNTRY_LIST.find((item) => item.code === country)?.name ?? country}
                onClear={() => setParam("pays", "")}
              />
            ) : null}
            {condition ? (
              <ActiveChip label={condition} onClear={() => setParam("etat", "")} />
            ) : null}
            {brand ? <ActiveChip label={brand} onClear={() => setParam("marque", "")} /> : null}
            {size ? <ActiveChip label={`Taille ${size}`} onClear={() => setParam("taille", "")} /> : null}
            {minPrice > PRICE_BOUNDS.min || maxPrice < PRICE_BOUNDS.max ? (
              <ActiveChip
                label={`${formatDA(minPrice)} – ${formatDA(maxPrice)}`}
                onClear={() => setMany({ min: "", max: "" })}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-[28px] border border-border/70 bg-white p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <p className="flex items-center gap-2 font-display text-lg font-bold text-brand-900">
                <SlidersHorizontal className="h-4 w-4 text-brand-500" />
                Filtres
              </p>
              {activeCount > 0 ? (
                <Badge variant="soft">{activeCount}</Badge>
              ) : null}
            </div>
            <Separator className="mb-6" />
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">{filters}</div>
          </div>
        </aside>

        <div>
          <ProductGrid
            products={filtered}
            emptyTitle="Aucune pièce ne correspond à ces filtres"
            emptyText="Réinitialisez les filtres ou explorez une autre catégorie — de nouvelles trouvailles arrivent chaque semaine."
          />
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[88vh] rounded-t-[32px] p-6">
          <SheetTitle className="flex items-center gap-2">
            <StarGlyph className="h-4 w-4 text-gold-400" />
            Filtres
          </SheetTitle>
          <div className="mt-5 pb-6">{filters}</div>
          <div className="sticky bottom-0 -mx-6 border-t border-border/60 bg-cream-50 px-6 py-4">
            <Button className="w-full" size="lg" onClick={() => setFiltersOpen(false)}>
              Voir {formatNumber(filtered.length)} pièce{filtered.length > 1 ? "s" : ""}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "az":
      return copy.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    default:
      return copy.sort((a, b) => b.createdAt - a.createdAt);
  }
}

function FilterBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <Label className="mb-3 block">{title}</Label>
      {children}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
        active
          ? "border-brand-800 bg-brand-800 text-white shadow-soft"
          : "border-border/80 bg-white text-ink-soft hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700",
      )}
    >
      {children}
    </button>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
    >
      {label}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full p-0.5 transition-colors hover:bg-brand-100"
        aria-label={`Retirer le filtre ${label}`}
      >
        <X className="h-3 w-3" />
      </button>
    </motion.span>
  );
}
