import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarGlyph, StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ctas } from "@/lib/ctas";
import { formatDA } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function Cart() {
  const { cartProducts, cartTotal, removeFromCart, clearCart } = useStore();

  if (cartProducts.length === 0) {
    return (
      <div className="container py-16">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-[36px] border border-dashed border-brand-200 bg-white/70 px-8 py-16 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-50 text-brand-500">
            <ShoppingBag className="h-9 w-9" />
          </span>
          <StarRow className="mt-6" />
          <h1 className="mt-4 font-display text-2xl font-black text-brand-900">
            Votre cabas est vide
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Chaque pièce de CABAS DZ est unique. Ajoutez votre trouvaille avant qu’un autre
            client ne la commande.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to={ctas.shop}>
              Découvrir les pièces disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <SectionHeading
        align="left"
        eyebrow="Panier"
        title="Votre sélection"
        subtitle="Le panier ne réserve pas encore vos pièces : elles restent disponibles jusqu'à la validation de la commande."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-[28px] border border-border/70 bg-white p-4 shadow-soft sm:p-5"
            >
              <Link
                to={`/produit/${product.id}`}
                className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream-200 sm:h-32 sm:w-28"
              >
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    to={`/produit/${product.id}`}
                    className="line-clamp-2 font-display text-base font-bold leading-snug text-brand-900 hover:text-brand-600 sm:text-lg"
                  >
                    {product.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                    aria-label={`Retirer ${product.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MiniFlag code={product.country} className="h-3 w-4" />
                    {product.condition}
                  </span>
                  {product.size ? <span>· Taille {product.size}</span> : null}
                </div>

                <div className="mt-auto flex items-end justify-between pt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700">
                    <StarGlyph className="h-2.5 w-2.5" />
                    Pièce unique
                  </span>
                  <p className="font-display text-lg font-black text-brand-900">
                    {formatDA(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="self-start" onClick={clearCart}>
            <Trash2 className="h-4 w-4" />
            Vider le panier
          </Button>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[28px] border border-border/70 bg-white p-6 shadow-soft">
            <h2 className="font-display text-xl font-black text-brand-900">Récapitulatif</h2>
            <Separator className="my-5" />

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between text-ink-soft">
                <span>
                  Sous-total ({cartProducts.length} pièce
                  {cartProducts.length > 1 ? "s" : ""})
                </span>
                <span className="font-semibold">{formatDA(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-soft">
                <span>Livraison</span>
                <span className="font-semibold text-brand-700">Selon wilaya</span>
              </div>
              <div className="flex items-center justify-between text-ink-soft">
                <span>Paiement</span>
                <span className="font-semibold">À la livraison</span>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Total
              </span>
              <span className="font-display text-2xl font-black text-brand-900">
                {formatDA(cartTotal)}
              </span>
            </div>

            <Button asChild size="xl" variant="gold" className="mt-6 w-full">
              <Link to={ctas.checkout}>
                Passer la commande
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <StarGlyph className="mt-0.5 h-3 w-3 shrink-0 text-gold-400" />
              À la validation, vos pièces passent automatiquement en « Vendu » et sont retirées
              de la boutique.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
