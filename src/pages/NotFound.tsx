import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { StarField, StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { ctas } from "@/lib/ctas";

export default function NotFound() {
  return (
    <div className="container py-16">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[40px] bg-brand-900 px-6 py-16 text-center text-white sm:px-12">
        <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
        <StarField />
        <div className="relative">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/10 text-gold-300">
            <Compass className="h-8 w-8" />
          </span>
          <p className="mt-6 font-display text-6xl font-black text-gold-300">404</p>
          <h1 className="mt-3 font-display text-3xl font-black sm:text-4xl">
            Cette page a disparu
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-brand-100/80">
            Un peu comme nos pièces uniques : quand elles partent, elles ne reviennent pas. Mais
            le catalogue, lui, est toujours ouvert.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gold">
              <Link to={ctas.shop}>
                Voir la boutique
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link to="/">Retour à l’accueil</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CATEGORIES.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                to={`${ctas.shop}?categorie=${category.id}`}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-brand-100 transition-colors hover:border-gold-300/50 hover:text-gold-300"
              >
                {category.emoji} {category.label}
              </Link>
            ))}
          </div>

          <StarRow className="mt-10" />
        </div>
      </div>
    </div>
  );
}
