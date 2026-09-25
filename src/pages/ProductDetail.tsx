import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  PackageCheck,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  ZoomIn,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CountryChip, MiniFlag } from "@/components/brand/CountryFlag";
import { StarField, StarGlyph, StarRow } from "@/components/brand/Stars";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { CATEGORY_BY_ID, CONDITION_STYLES, COUNTRIES } from "@/lib/constants";
import { ctas } from "@/lib/ctas";
import { formatDA, timeAgo, whatsappLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { productById, addToCart, availableProducts, settings } = useStore();

  const product = id ? productById(id) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCategory = availableProducts.filter(
      (item) => item.id !== product.id && item.category === product.category,
    );
    const others = availableProducts.filter(
      (item) => item.id !== product.id && item.category !== product.category,
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [product, availableProducts]);

  if (!product) {
    return (
      <div className="container flex flex-col items-center gap-5 py-24 text-center">
        <StarRow />
        <h1 className="font-display text-3xl font-black text-brand-900">
          Cette pièce n’existe plus
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Elle a peut-être déjà trouvé son propriétaire, ou le lien est incomplet.
        </p>
        <Button asChild size="lg">
          <Link to={ctas.shop}>Retour à la boutique</Link>
        </Button>
      </div>
    );
  }

  const sold = product.status === "SOLD";
  const reserved = product.status === "RESERVED";
  const buyable = product.status === "AVAILABLE";
  const country = COUNTRIES[product.country];
  const category = CATEGORY_BY_ID[product.category];

  const waMessage = `Bonjour CABAS DZ, je souhaite commander : ${product.title} — ${formatDA(product.price)}.`;
  const waHref = whatsappLink(settings.whatsappNumber, waMessage);

  const add = () => {
    const result = addToCart(product.id);
    toast({
      title: result.message,
      description: result.ok ? "Retrouvez-la dans votre panier." : undefined,
      tone: result.ok ? "success" : "error",
    });
  };

  const buyNow = () => {
    const result = addToCart(product.id);
    if (!result.ok) {
      toast({ title: result.message, tone: "error" });
      return;
    }
    navigate(ctas.checkout);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, text: waMessage, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast({ title: "Lien copié", description: "Partagez cette pièce unique.", tone: "success" });
    } catch {
      toast({ title: "Partage indisponible", tone: "info" });
    }
  };

  const specs = [
    { label: "État", value: product.condition },
    { label: "Marque", value: product.brand || "—" },
    { label: "Taille", value: product.size || "—" },
    { label: "Catégorie", value: category?.label ?? product.category },
    { label: "Époque", value: product.era || "—" },
    { label: "Matière", value: product.material || "—" },
    { label: "Origine", value: `${country.flag} ${country.name}` },
    { label: "Disponibilité", value: sold ? "Vendu" : reserved ? "Réservé" : "En stock (1)" },
  ];

  return (
    <div className="pb-8">
      <div className="container pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </div>

      <div className="container mt-4 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-white p-3 shadow-soft">
            <div
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-cream-200",
                zoom ? "cursor-zoom-out" : "cursor-zoom-in",
              )}
              onClick={() => setZoom((value) => !value)}
            >
              {product.images[activeImage] ? (
                <motion.img
                  key={product.images[activeImage]}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: zoom ? 1.5 : 1 }}
                  transition={{ duration: 0.4 }}
                  src={product.images[activeImage]}
                  alt={product.title}
                  className={cn("h-full w-full object-cover", sold && "grayscale-[35%]")}
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-brand-300">
                  <Sparkles className="h-10 w-10" />
                </div>
              )}

              <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
                <Badge variant="gold" className="shadow-soft">
                  <StarGlyph className="h-2.5 w-2.5" />
                  Unique Produit
                </Badge>
                {!sold ? (
                  <Badge variant="available" className="bg-white/90 backdrop-blur">
                    1 seul exemplaire
                  </Badge>
                ) : null}
              </div>

              <span className="pointer-events-none absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-brand-700 shadow-soft backdrop-blur">
                <ZoomIn className="h-4 w-4" />
              </span>

              {sold ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-brand-950/35 backdrop-blur-[2px]">
                  <div className="rotate-[-8deg] rounded-3xl border border-white/25 bg-brand-900/85 px-10 py-5 text-center shadow-lift">
                    <p className="font-display text-4xl font-black tracking-[0.2em] text-gold-300">
                      VENDU
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                      Cette pièce a déjà trouvé son propriétaire
                    </p>
                  </div>
                </div>
              ) : null}

              {reserved ? (
                <div className="pointer-events-none absolute inset-0 grid place-items-center bg-brand-950/25 backdrop-blur-[2px]">
                  <div className="rounded-3xl border border-white/25 bg-white/95 px-8 py-4 text-center shadow-lift">
                    <p className="font-display text-2xl font-black tracking-[0.16em] text-brand-800">
                      RÉSERVÉ
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      En cours de confirmation
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveImage(index);
                      setZoom(false);
                    }}
                    className={cn(
                      "h-20 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all",
                      index === activeImage
                        ? "border-brand-700"
                        : "border-transparent opacity-70 hover:opacity-100",
                    )}
                    aria-label={`Image ${index + 1}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-4 hidden justify-between gap-2 lg:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveImage((value) => Math.max(0, value - 1))}
              disabled={activeImage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setActiveImage((value) => Math.min(product.images.length - 1, value + 1))
              }
              disabled={activeImage >= product.images.length - 1}
            >
              Suivante
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`${ctas.shop}?categorie=${product.category}`}
              className="chip hover:border-brand-300 hover:text-brand-700"
            >
              <span aria-hidden="true">{category?.emoji}</span>
              {category?.label}
            </Link>
            <CountryChip code={product.country} />
            <span className="chip">{timeAgo(product.createdAt)}</span>
          </div>

          <h1 className="mt-5 font-display text-3xl font-black leading-tight text-brand-900 sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold",
                CONDITION_STYLES[product.condition],
              )}
            >
              <Check className="h-3.5 w-3.5" />
              {product.condition}
            </span>
            {product.brand ? <span className="chip">{product.brand}</span> : null}
            {product.era ? <span className="chip">{product.era}</span> : null}
          </div>

          {/* scarcity block */}
          <div className="relative mt-6 overflow-hidden rounded-[28px] border border-gold-200 bg-gold-50 p-5">
            <StarField className="opacity-40" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-3xl font-black text-brand-900">
                  {formatDA(product.price)}
                </p>
                {product.compareAtPrice ? (
                  <p className="mt-1 text-sm font-semibold text-muted-foreground line-through">
                    {formatDA(product.compareAtPrice)}
                  </p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1.5 text-xs font-black uppercase tracking-widest text-gold-700">
                  <StarGlyph className="h-3 w-3" />
                  Unique Produit
                </p>
                <p className="mt-1 text-sm font-bold text-brand-800">
                  {sold
                    ? "Déjà vendu"
                    : reserved
                      ? "Réservé par un client"
                      : "1 SEUL EXEMPLAIRE DISPONIBLE"}
                </p>
              </div>
            </div>
          </div>

          {sold ? (
            <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50 px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-bold text-rose-800">
                <StarRow count={3} className="justify-start text-rose-400" starClassName="h-3 w-3" />
                Cette pièce a déjà trouvé son propriétaire.
              </p>
              <p className="mt-1.5 text-xs text-rose-700/80">
                L’achat est désactivé car le produit est unique et n’est plus en stock.
              </p>
            </div>
          ) : null}

          {/* CTAs */}
          {buyable ? (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="xl" className="flex-1" onClick={buyNow}>
                  <ShoppingBag className="h-4 w-4" />
                  Acheter maintenant
                </Button>
                <Button size="xl" variant="outline" className="flex-1" onClick={add}>
                  Ajouter au panier
                </Button>
              </div>
              <Button
                asChild
                size="xl"
                className="bg-[#25D366] text-white shadow-soft hover:bg-[#1eb356]"
              >
                <a href={waHref} target="_blank" rel="noreferrer noopener">
                  <MessageCircle className="h-4 w-4" />
                  Commander sur WhatsApp
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={share} className="self-start">
                <Share2 className="h-3.5 w-3.5" />
                Partager cette pièce
              </Button>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              <Button size="xl" disabled className="w-full">
                {sold ? "Produit vendu — achat désactivé" : "Produit réservé"}
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to={ctas.shop}>Voir les pièces encore disponibles</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={share} className="self-start">
                <Share2 className="h-3.5 w-3.5" />
                Partager
              </Button>
            </div>
          )}

          {/* shipping */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Perk icon={<Truck className="h-4 w-4" />} label="Livraison 58 wilayas" />
            <Perk icon={<ShieldCheck className="h-4 w-4" />} label="Paiement à la livraison" />
            <Perk icon={<PackageCheck className="h-4 w-4" />} label="Emballage soigné" />
          </div>

          {/* description */}
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="font-display text-lg font-bold text-brand-900">
                Description de la pièce
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {product.description}
              </p>
            </section>

            {product.measurements ? (
              <section className="rounded-3xl border border-border/70 bg-white p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-brand-900">
                  <Ruler className="h-4 w-4 text-brand-500" />
                  Mesures
                </h2>
                <p className="mt-2 text-sm text-ink-soft">{product.measurements}</p>
              </section>
            ) : null}

            <section>
              <h2 className="font-display text-lg font-bold text-brand-900">
                Fiche du produit
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-2xl border border-border/70 bg-cream-100 px-4 py-3"
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-brand-900">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-3xl border border-border/70 bg-white p-5">
              <h2 className="font-display text-lg font-bold text-brand-900">
                Livraison & paiement
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {settings.deliveryInfo}
              </p>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground">
                Origine : {country.flag} {country.name}
                {product.city ? ` · ${product.city}` : ""} · Importé et contrôlé par CABAS DZ.
              </p>
            </section>

            {product.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`${ctas.shop}?q=${encodeURIComponent(tag)}`}
                    className="chip hover:border-brand-300 hover:text-brand-700"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="container mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black text-brand-900">
                Vous aimerez aussi
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                D’autres pièces uniques de notre sélection européenne.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to={ctas.shop}>Toute la boutique</Link>
            </Button>
          </div>
          <div className="mt-7">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}

      {/* sticky mobile purchase bar */}
      <AnimatePresence>
        {buyable ? (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="fixed inset-x-3 bottom-[86px] z-30 lg:hidden"
          >
            <div className="glass flex items-center gap-3 rounded-3xl border border-border/70 p-2.5 shadow-lift">
              <div className="min-w-0 flex-1 pl-2">
                <p className="truncate text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <MiniFlag code={product.country} className="mr-1 inline-block h-3 w-4 align-[-1px]" />
                  1 seul exemplaire
                </p>
                <p className="truncate font-display text-base font-black text-brand-900">
                  {formatDA(product.price)}
                </p>
              </div>
              <Button size="default" onClick={buyNow}>
                <ShoppingBag className="h-4 w-4" />
                Commander
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Perk({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-white px-3.5 py-3 text-xs font-semibold text-ink-soft">
      <span className="text-brand-600">{icon}</span>
      {label}
    </div>
  );
}
