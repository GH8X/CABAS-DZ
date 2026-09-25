import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  PackageCheck,
  Plane,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { Reveal, RevealGroup, RevealItem } from "@/components/brand/Reveal";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarField, StarGlyph, StarRow } from "@/components/brand/Stars";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANNOT_MISS_NOTE, PROMISES } from "@/lib/copy";
import {
  CATEGORIES,
  COUNTRIES,
  FEATURED_COUNTRIES,
} from "@/lib/constants";
import { ctas } from "@/lib/ctas";
import { formatDA } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function Home() {
  const { settings, availableProducts, newArrivals, soldProducts, reservedProducts, products } =
    useStore();

  const featured =
    availableProducts.filter((product) => product.featured).slice(0, 8).length >= 4
      ? availableProducts.filter((product) => product.featured).slice(0, 8)
      : availableProducts.slice(0, 8);

  const stats = [
    { label: "Pièces en ligne", value: products.length },
    { label: "Disponibles", value: availableProducts.length },
    { label: "Déjà trouvées", value: soldProducts.length },
  ];

  return (
    <div className="overflow-hidden">
      {/* ============================= HERO ============================= */}
      <section className="relative">
        <div className="container relative pt-8 sm:pt-12">
          <div className="relative overflow-hidden rounded-[36px] bg-brand-900 px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
            <StarField />

            <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200 backdrop-blur"
                >
                  <StarGlyph className="h-3 w-3" />
                  Importé d'Europe · 1 seul exemplaire
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="mt-6 font-display text-[38px] font-black leading-[1.06] text-white sm:text-5xl lg:text-[58px]"
                >
                  {settings.heroTitle}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16 }}
                  className="mt-6 max-w-xl text-base leading-relaxed text-brand-100/85 sm:text-lg"
                >
                  {settings.heroSubtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.24 }}
                  className="mt-9 flex flex-col gap-3 sm:flex-row"
                >
                  <Button asChild size="xl" variant="gold">
                    <Link to={ctas.newArrivals}>
                      Découvrir les nouveautés
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="xl"
                    className="border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
                  >
                    <Link to={ctas.unique}>
                      <Sparkles className="h-4 w-4" />
                      Explorer les pièces uniques
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
                >
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-2xl font-black text-gold-300">
                        {stat.value}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-200/70">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2">
                    {FEATURED_COUNTRIES.map((code) => (
                      <MiniFlag key={code} code={code} className="h-3.5 w-5" />
                    ))}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-100/80">
                      + Europe
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* hero collage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <HeroImage
                      src={settings.heroImage}
                      alt="Trouvailles européennes CABAS DZ"
                      className="h-52 sm:h-64"
                      delay={0}
                    />
                    <HeroImage
                      src={availableProducts[1]?.images[0] ?? settings.heroImage}
                      alt="Pièce vintage importée d'Europe"
                      className="h-36 sm:h-44"
                      delay={0.6}
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <HeroImage
                      src={availableProducts[0]?.images[0] ?? settings.heroImage}
                      alt="Pièce unique disponible"
                      className="h-36 sm:h-44"
                      delay={0.3}
                    />
                    <HeroImage
                      src={availableProducts[2]?.images[0] ?? settings.heroImage}
                      alt="Objet de brocante européen"
                      className="h-52 sm:h-64"
                      delay={0.9}
                    />
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-3 top-1/2 hidden rounded-3xl border border-white/20 bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:block"
                >
                  <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gold-700">
                    <StarGlyph className="h-2.5 w-2.5" />
                    Unique Produit
                  </p>
                  <p className="mt-1 font-display text-lg font-black text-brand-900">
                    1 seul exemplaire
                  </p>
                </motion.div>

                {availableProducts[0] ? (
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-5 right-0 rounded-3xl border border-white/20 bg-white/95 px-4 py-3 shadow-lift backdrop-blur"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                      Dernière trouvaille
                    </p>
                    <p className="mt-0.5 max-w-[11rem] truncate text-sm font-bold text-brand-900">
                      {availableProducts[0].title}
                    </p>
                    <p className="mt-0.5 font-display text-base font-black text-brand-700">
                      {formatDA(availableProducts[0].price)}
                    </p>
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ PROMISES ============================ */}
      <section className="container mt-8">
        <RevealGroup className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {PROMISES.map((promise) => (
            <RevealItem key={promise.title}>
              <div className="flex h-full items-start gap-3 rounded-3xl border border-border/70 bg-white/80 p-4 shadow-soft backdrop-blur transition-transform duration-300 hover:-translate-y-1">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <promise.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-900">{promise.title}</p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {promise.text}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ======================= EUROPEAN DISCOVERY ======================= */}
      <section className="container mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] border border-border/70 bg-white px-6 py-12 shadow-soft sm:px-12">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-50 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative">
              <SectionHeading
                align="left"
                eyebrow="Origines"
                title="Des trouvailles sélectionnées à travers l’Europe."
                subtitle="Chaque pièce porte l’empreinte de son pays. Filtrez par origine et découvrez ce que chaque marché européen a de plus singulier."
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {FEATURED_COUNTRIES.map((code, index) => {
                  const meta = COUNTRIES[code];
                  const count = availableProducts.filter((p) => p.country === code).length;
                  return (
                    <Reveal key={code} delay={index * 0.08}>
                      <Link
                        to={`${ctas.shop}?pays=${code}`}
                        className="group flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-border/70 bg-cream-100 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-lift"
                      >
                        <div className="flex items-start justify-between">
                          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-3xl shadow-soft">
                            {meta.flag}
                          </span>
                          <MiniFlag code={code} className="h-5 w-8 rounded-md" />
                        </div>
                        <div className="mt-10">
                          <p className="font-display text-2xl font-black uppercase tracking-tight text-brand-900">
                            {meta.name}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {count} pièce{count > 1 ? "s" : ""} disponible
                            {count > 1 ? "s" : ""}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 transition-transform duration-300 group-hover:translate-x-1">
                            Explorer
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {(["IT", "BE", "NL", "EU"] as const).map((code) => (
                  <Link
                    key={code}
                    to={`${ctas.shop}?pays=${code}`}
                    className="chip hover:border-brand-300 hover:text-brand-700"
                  >
                    <MiniFlag code={code} className="h-3 w-4" />
                    {COUNTRIES[code].name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================== CATEGORIES =========================== */}
      <section className="container mt-24">
        <SectionHeading
          eyebrow="Catégories"
          title="Choisissez votre terrain de chasse"
          subtitle="Neuf univers, une seule règle : chaque pièce est unique."
        />
        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <RevealItem key={category.id}>
              <Link
                to={`${ctas.shop}?categorie=${category.id}`}
                className={`group relative block overflow-hidden rounded-[28px] border border-border/70 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift ${
                  index === 0 ? "sm:col-span-1" : ""
                }`}
              >
                <div className="relative h-40 overflow-hidden sm:h-44">
                  <img
                    src={category.image}
                    alt={category.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/20 to-transparent" />
                  <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-2xl bg-white/90 text-lg shadow-soft backdrop-blur">
                    {category.emoji}
                  </span>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-display text-base font-bold text-brand-900">
                      {category.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{category.blurb}</p>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-700 transition-all duration-300 group-hover:bg-brand-800 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ========================= UNIQUE PRODUIT ========================= */}
      <section className="relative mt-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[40px] border border-brand-100 bg-gradient-to-b from-brand-50/70 to-cream-100 px-6 py-14 sm:px-10">
            <StarField className="opacity-60" />
            <div className="relative">
              <SectionHeading
                eyebrow="Le cœur de CABAS DZ"
                title={
                  <>
                    {settings.uniqueTitle}
                    <span className="mt-2 block text-lg font-semibold not-italic text-brand-500 sm:text-xl">
                      قطعة واحدة فقط
                    </span>
                  </>
                }
                subtitle={settings.uniqueSubtitle}
              />

              <div className="mt-10">
                <ProductGrid
                  products={featured}
                  emptyTitle="De nouvelles pièces arrivent très bientôt"
                  emptyText="Revenez dans quelques jours — nos trouvailles changent constamment."
                />
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                <Button asChild size="lg" variant="default">
                  <Link to={ctas.unique}>
                    Voir toutes les pièces uniques
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-700">
                  <StarRow count={3} starClassName="h-2.5 w-2.5" />
                  {CANNOT_MISS_NOTE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= NEW ARRIVALS ========================= */}
      <section className="container mt-24">
        <SectionHeading
          align="left"
          eyebrow="Fraîchement arrivées"
          title="Dernières Trouvailles"
          subtitle="Les pièces tout juste ramenées d’Europe. Ce que vous voyez aujourd’hui peut disparaître demain."
          action={
            <Button asChild variant="outline" size="lg">
              <Link to={ctas.newArrivals}>
                Toutes les nouveautés
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-10">
          <ProductGrid products={newArrivals.slice(0, 4)} />
        </div>
      </section>

      {/* ========================== EU STORY ========================== */}
      <section className="container mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] bg-brand-900 px-6 py-14 text-white sm:px-12">
            <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
            <StarField />
            <div className="relative">
              <SectionHeading
                tone="dark"
                eyebrow="Notre histoire"
                title="De l’Europe à l’Algérie"
                subtitle={settings.storyText}
              />

              <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-3xl border border-white/15 bg-white/10 text-4xl backdrop-blur">
                    🇪🇺
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-300">
                    Europe
                  </p>
                </div>

                <div className="flex flex-1 items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent" />
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-shine text-brand-900 shadow-lift"
                  >
                    <Plane className="h-5 w-5" />
                  </motion.span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent" />
                </div>

                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="grid h-20 w-20 place-items-center rounded-3xl border border-white/15 bg-white/10 text-4xl backdrop-blur">
                    🇩🇿
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-gold-300">
                    Algérie
                  </p>
                </div>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: BadgeCheck,
                    title: "Chiné à la main",
                    text: "Brocantes, marchés aux puces et dépôts-vente de France, d’Allemagne et d’Espagne.",
                  },
                  {
                    icon: Truck,
                    title: "Ramené en Algérie",
                    text: "Chaque pièce est contrôlée, nettoyée puis expédiée vers notre atelier.",
                  },
                  {
                    icon: Boxes,
                    title: "Un seul exemplaire",
                    text: "Nous ne rachetons jamais deux fois la même pièce. Ce que vous voyez est tout ce qu’il y a.",
                  },
                ].map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.08}>
                    <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-shine text-brand-900">
                        <step.icon className="h-5 w-5" />
                      </span>
                      <p className="mt-4 font-display text-lg font-bold text-white">
                        {step.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-brand-100/75">
                        {step.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Button asChild size="lg" variant="gold">
                  <Link to={ctas.about}>
                    Notre démarche complète
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================== SOLD =========================== */}
      <section className="container mt-24">
        <SectionHeading
          eyebrow="Déjà trouvés"
          title="Vendus"
          subtitle="Cette pièce a déjà trouvé son propriétaire. Le stock change chaque semaine — revenez souvent."
          action={
            <Button asChild variant="outline" size="lg">
              <Link to={ctas.sold}>
                Voir toutes les pièces vendues
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-10">
          {soldProducts.length > 0 ? (
            <ProductGrid products={soldProducts.slice(0, 4)} />
          ) : (
            <p className="rounded-3xl border border-dashed border-brand-200 bg-white/70 px-6 py-12 text-center text-sm text-muted-foreground">
              Aucune pièce vendue pour le moment — toutes nos trouvailles sont encore
              disponibles.
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <MiniStat
            icon={PackageCheck}
            label="Pièces vendues"
            value={soldProducts.length}
            hint="Reparties chez leurs propriétaires"
          />
          <MiniStat
            icon={Boxes}
            label="Encore disponibles"
            value={availableProducts.length}
            hint="À saisir avant disparition"
          />
          <MiniStat
            icon={ShieldCheck}
            label="Réservées"
            value={reservedProducts.length}
            hint="En cours de confirmation"
          />
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="container mt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] border border-gold-200 bg-gold-shine px-6 py-14 text-center sm:px-12">
            <StarRow className="justify-center text-brand-900/60" starClassName="h-4 w-4" />
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-black leading-tight text-brand-900 sm:text-4xl">
              Tu le vois → Tu l’aimes → Tu le prends → Il disparaît.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-brand-900/75 sm:text-base">
              CABAS DZ n’est pas un magasin de stock. C’est un marché de trouvailles : quand une
              pièce part, elle ne revient pas.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="default">
                <Link to={ctas.shop}>
                  Entrer dans la boutique
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                className="border border-brand-900/20 bg-white/70 text-brand-900 backdrop-blur hover:bg-white"
              >
                <Link to={ctas.contact}>Nous contacter</Link>
              </Button>
            </div>
            <Badge variant="default" className="mt-8">
              🇪🇺 European Finds • 🇩🇿 Algerian Market
            </Badge>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function HeroImage({
  src,
  alt,
  className,
  delay,
}: {
  src: string;
  alt: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={`overflow-hidden rounded-[28px] border border-white/15 bg-brand-800 shadow-lift ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="eager" />
    </motion.div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Boxes;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-white p-5 shadow-soft">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-2xl font-black text-brand-900">{value}</p>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{label}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
