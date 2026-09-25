import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CATEGORIES, categoryLabel } from "@/lib/constants";
import { formatDA } from "@/lib/format";
import { useStore } from "@/lib/store";

const QUICK_TAGS = ["Vintage", "Cuir", "Jouets anciens", "France", "Allemagne", "Espagne"];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { products } = useStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((product) =>
        [product.title, product.brand, product.description, ...product.tags]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 6);
  }, [products, query]);

  const submit = (value: string) => {
    const term = value.trim();
    onOpenChange(false);
    setQuery("");
    navigate(term ? `/boutique?q=${encodeURIComponent(term)}` : "/boutique");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="top-[18%] max-h-[70vh] translate-y-0 p-0">
        <DialogTitle className="sr-only">Rechercher une pièce unique</DialogTitle>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(query);
          }}
          className="flex items-center gap-3 border-b border-border/60 px-5 py-4"
        >
          <Search className="h-5 w-5 shrink-0 text-brand-400" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une pièce, une marque, un pays…"
            className="h-10 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-800 p-2 text-white transition-colors hover:bg-brand-900"
            aria-label="Lancer la recherche"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="px-5 pb-5">
          {query.trim() === "" ? (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Recherches fréquentes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => submit(tag)}
                    className="rounded-full border border-border/70 bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Explorer par catégorie
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/boutique?categorie=${category.id}`);
                    }}
                    className="flex items-center gap-2 rounded-2xl border border-border/70 bg-white px-3 py-2.5 text-left text-xs font-bold text-ink-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
                  >
                    <span aria-hidden="true">{category.emoji}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucune pièce ne correspond à « {query} ».
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {results.map((product, index) => (
                <motion.li
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      setQuery("");
                      navigate(`/produit/${product.id}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-brand-50"
                  >
                    <span className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-brand-900">
                        {product.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                        <MiniFlag code={product.country} className="h-3 w-4" />
                        {categoryLabel(product.category)}
                        {product.status === "SOLD" ? " · Vendu" : ""}
                      </span>
                    </span>
                    <span className="shrink-0 font-display text-sm font-black text-brand-900">
                      {formatDA(product.price)}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
