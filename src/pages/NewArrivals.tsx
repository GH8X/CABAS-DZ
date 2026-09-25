import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarGlyph, StarRow } from "@/components/brand/Stars";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ctas } from "@/lib/ctas";
import { isNewArrival } from "@/lib/format";
import { useStore } from "@/lib/store";

const WINDOWS = [
  { value: "7", label: "7 derniers jours" },
  { value: "14", label: "14 derniers jours" },
  { value: "30", label: "30 derniers jours" },
  { value: "all", label: "Tout" },
];

export default function NewArrivals() {
  const { products } = useStore();
  const [window, setWindow] = useState("14");

  const list = useMemo(() => {
    const sorted = [...products].sort((a, b) => b.createdAt - a.createdAt);
    if (window === "all") return sorted;
    const days = Number(window);
    return sorted.filter((product) => isNewArrival(product.createdAt, days));
  }, [products, window]);

  const available = list.filter((product) => product.status === "AVAILABLE");

  return (
    <div className="container py-10">
      <div className="relative overflow-hidden rounded-[36px] border border-border/70 bg-white px-6 py-12 shadow-soft sm:px-12">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-100 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <SectionHeading
            align="left"
            eyebrow="Fraîchement arrivées d'Europe"
            title="Dernières Trouvailles"
            subtitle="Les pièces les plus récemment chinées. Elles apparaissent ici automatiquement à leur mise en ligne — et peuvent disparaître dès qu'un client les commande."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.span
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-widest text-gold-300 shadow-soft"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-300" />
              New
            </motion.span>
            <Badge variant="soft">
              <StarGlyph className="h-2.5 w-2.5" />
              {available.length} disponible{available.length > 1 ? "s" : ""}
            </Badge>
            <Badge variant="muted">{list.length} nouveauté{list.length > 1 ? "s" : ""}</Badge>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Tabs value={window} onValueChange={setWindow}>
          <TabsList className="overflow-x-auto no-scrollbar">
            {WINDOWS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-8">
        <ProductGrid
          products={list}
          emptyTitle="Aucune nouveauté sur cette période"
          emptyText="Essayez une période plus large — nos arrivages sont irréguliers, comme les brocantes."
        />
      </div>

      <div className="mt-14 flex flex-col items-center gap-5 rounded-[32px] bg-brand-900 px-6 py-12 text-center">
        <StarRow />
        <h3 className="max-w-xl font-display text-2xl font-black text-white sm:text-3xl">
          Les nouveautés partent en premier.
        </h3>
        <p className="max-w-lg text-sm text-brand-100/80">
          Chaque pièce est unique : quand elle est commandée, elle quitte définitivement la
          boutique. Revenez régulièrement pour ne rien manquer.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link to={ctas.unique}>
              <Sparkles className="h-4 w-4" />
              Explorer les pièces uniques
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <Link to={ctas.shop}>
              Voir toute la boutique
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
