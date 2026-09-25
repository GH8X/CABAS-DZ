import { ArrowRight, Heart, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarGlyph, StarRow } from "@/components/brand/Stars";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ctas } from "@/lib/ctas";
import { formatDA } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function Sold() {
  const { soldProducts } = useStore();
  const totalValue = soldProducts.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="container py-10">
      <SectionHeading
        align="left"
        eyebrow="Déjà trouvés"
        title="Vendus"
        subtitle="Ces pièces ont quitté l'Europe pour un nouveau foyer en Algérie. Cette page est la preuve que le catalogue tourne — et qu'il faut agir vite."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Heart className="h-5 w-5" />}
          value={String(soldProducts.length)}
          label="Pièces vendues"
          hint="Chacune unique, aucune réédition"
        />
        <StatCard
          icon={<StarGlyph className="h-5 w-5" />}
          value={formatDA(totalValue)}
          label="Valeur totale adoptée"
          hint="Des pièces parties chez nos clients"
        />
        <StatCard
          icon={<RotateCcw className="h-5 w-5" />}
          value="0"
          label="Réapprovisionnements"
          hint="Une pièce vendue ne revient jamais"
        />
      </div>

      <div className="mt-10 rounded-[32px] border border-rose-100 bg-rose-50/60 px-6 py-6">
        <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-rose-800">
          <StarRow count={3} className="justify-start text-rose-400" starClassName="h-3 w-3" />
          Cette pièce a déjà trouvé son propriétaire.
        </p>
        <p className="mt-2 max-w-2xl text-sm text-rose-700/80">
          Les produits vendus restent visibles pour montrer l’authenticité de notre sélection et
          la vitesse à laquelle le catalogue évolue. Aucun d’entre eux ne peut être commandé à
          nouveau.
        </p>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center gap-2">
          <Badge variant="sold">{soldProducts.length} pièce(s) vendue(s)</Badge>
        </div>
        <ProductGrid
          products={soldProducts}
          emptyTitle="Aucune pièce vendue pour l'instant"
          emptyText="Toutes nos trouvailles sont encore disponibles. Soyez parmi les premiers."
        />
      </div>

      <div className="mt-14 flex flex-col items-center gap-5 rounded-[36px] bg-brand-900 px-6 py-12 text-center">
        <StarRow />
        <h3 className="max-w-xl font-display text-2xl font-black text-white sm:text-3xl">
          D’autres pièces uniques vous attendent.
        </h3>
        <p className="max-w-lg text-sm text-brand-100/80">
          Le catalogue change chaque semaine. Ce qui est vendu aujourd’hui annonce ce qui arrive
          demain.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link to={ctas.shop}>
              Voir les pièces disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <Link to={ctas.newArrivals}>Dernières trouvailles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  hint,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[28px] border border-border/70 bg-white p-5 shadow-soft">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-black text-brand-900">{value}</p>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{label}</p>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
