import { ArrowRight, Gem, Infinity as InfinityIcon, PackageX, ScanSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarField, StarGlyph, StarRow } from "@/components/brand/Stars";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES } from "@/lib/constants";
import { ctas } from "@/lib/ctas";
import { SCARCITY_LINE } from "@/lib/copy";
import { useStore } from "@/lib/store";

const RULES = [
  {
    icon: Gem,
    title: "1 seul exemplaire",
    text: "Chaque fiche produit correspond à une pièce physique unique. Le stock est donc toujours de 1.",
  },
  {
    icon: PackageX,
    title: "Vendu = disparu",
    text: "Dès qu'une commande est validée, la pièce passe en VENDU et ne peut plus être achetée par personne.",
  },
  {
    icon: ScanSearch,
    title: "Aucun réapprovisionnement",
    text: "Nous ne rachetons jamais deux fois la même pièce. Impossible de la commander à nouveau.",
  },
  {
    icon: InfinityIcon,
    title: "Le catalogue tourne en continu",
    text: "De nouvelles trouvailles remplacent les anciennes chaque semaine. Revenez souvent.",
  },
];

export default function UniqueProduit() {
  const { availableProducts, settings } = useStore();
  const [category, setCategory] = useState("all");

  const list = useMemo(
    () =>
      category === "all"
        ? availableProducts
        : availableProducts.filter((product) => product.category === category),
    [availableProducts, category],
  );

  const usedCategories = CATEGORIES.filter((item) =>
    availableProducts.some((product) => product.category === item.id),
  );

  return (
    <div className="container py-10">
      <div className="relative overflow-hidden rounded-[40px] bg-brand-900 px-6 py-14 text-white sm:px-12">
        <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
        <StarField />
        <div className="relative">
          <SectionHeading
            tone="dark"
            eyebrow="Le concept CABAS DZ"
            title={
              <>
                {settings.uniqueTitle}
                <span className="mt-3 block text-xl font-semibold not-italic text-gold-300">
                  قطعة واحدة فقط
                </span>
              </>
            }
            subtitle={settings.uniqueSubtitle}
          />

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { label: "Exemplaires par produit", value: "1" },
              { label: "Réapprovisionnement", value: "Jamais" },
              { label: "Disponibles maintenant", value: String(availableProducts.length) },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-center backdrop-blur"
              >
                <p className="font-display text-3xl font-black text-gold-300">{item.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-brand-100/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm font-bold uppercase tracking-[0.12em] text-gold-200">
            <StarRow count={3} starClassName="h-2.5 w-2.5" />
            {SCARCITY_LINE}
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RULES.map((rule) => (
          <div
            key={rule.title}
            className="h-full rounded-[28px] border border-border/70 bg-white p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-100 text-gold-700">
              <rule.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-base font-bold text-brand-900">{rule.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{rule.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="gold">
              <StarGlyph className="h-2.5 w-2.5" />
              Unique Produit
            </Badge>
            <Badge variant="soft">{availableProducts.length} pièces disponibles</Badge>
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="mt-5">
          <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            {usedCategories.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>
                <span aria-hidden="true">{item.emoji}</span>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-8">
          <ProductGrid
            products={list}
            emptyTitle="Plus rien dans cette catégorie"
            emptyText="Toutes les pièces de cette catégorie ont trouvé leur propriétaire. D'autres arrivent bientôt."
          />
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-5 rounded-[36px] border border-gold-200 bg-gold-50 px-6 py-12 text-center">
        <StarRow className="text-gold-500" starClassName="h-4 w-4" />
        <h3 className="max-w-xl font-display text-2xl font-black text-brand-900 sm:text-3xl">
          Une pièce vous a tapé dans l’œil ?
        </h3>
        <p className="max-w-lg text-sm text-muted-foreground">
          Ne réfléchissez pas trop longtemps. Une fois vendue, elle ne réapparaîtra jamais dans
          la boutique.
        </p>
        <Button asChild size="lg" variant="default">
          <Link to={ctas.shop}>
            Voir toutes les pièces
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
