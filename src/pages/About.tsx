import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Compass,
  HeartHandshake,
  Plane,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { Reveal } from "@/components/brand/Reveal";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarField, StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { COUNTRIES, FEATURED_COUNTRIES } from "@/lib/constants";
import { ctas } from "@/lib/ctas";
import { SCARCITY_LINE } from "@/lib/copy";
import { useStore } from "@/lib/store";

const VALUES = [
  {
    icon: BadgeCheck,
    title: "Authenticité",
    text: "Chaque pièce est un objet réel, avec son histoire, ses traces et son caractère. Rien n'est neuf, rien n'est copié.",
  },
  {
    icon: Boxes,
    title: "Rareté",
    text: "Nous ne vendons jamais deux fois la même pièce. La quantité est toujours de 1 — c'est notre règle fondatrice.",
  },
  {
    icon: HeartHandshake,
    title: "Confiance",
    text: "Paiement à la livraison, photos fidèles, descriptions honnêtes sur l'état et les mesures.",
  },
  {
    icon: Sparkles,
    title: "Curation",
    text: "Nous ne remplissons pas des cartons. Nous choisissons des pièces qui valent le détour.",
  },
];

export default function About() {
  const { settings, products, soldProducts } = useStore();

  return (
    <div className="container py-10">
      <div className="relative overflow-hidden rounded-[40px] bg-brand-900 px-6 py-16 text-white sm:px-12">
        <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
        <StarField />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-200">
            <MiniFlag code="EU" className="h-3.5 w-5" />
            Notre histoire
          </span>
          <h1 className="mt-6 font-display text-4xl font-black leading-tight sm:text-5xl">
            Le cabas qui traverse l’Europe pour vous.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-brand-100/85 sm:text-lg">
            {settings.storyText}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" variant="gold">
              <Link to={ctas.shop}>
                Explorer la boutique
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link to={ctas.contact}>Nous écrire</Link>
            </Button>
          </div>
        </div>
      </div>

      <Reveal className="mt-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: String(products.length), label: "Pièces chinées", hint: "Depuis notre ouverture" },
            { value: String(soldProducts.length), label: "Pièces adoptées", hint: "Déjà chez nos clients" },
            { value: "3+", label: "Pays d'origine", hint: "France · Allemagne · Espagne" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[32px] border border-border/70 bg-white p-7 text-center shadow-soft"
            >
              <p className="font-display text-4xl font-black text-brand-800">{item.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="mt-20">
        <SectionHeading
          eyebrow="Notre parcours"
          title="De l’Europe à l’Algérie"
          subtitle="Un trajet simple, répété chaque mois, pour ramener des pièces que l’on ne trouve nulle part ailleurs ici."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {[
            {
              step: "01",
              icon: Compass,
              title: "Repérage en Europe",
              text: "Brocantes, marchés aux puces, dépôts-vente et salles de ventes en France, en Allemagne et en Espagne.",
            },
            {
              step: "02",
              icon: Plane,
              title: "Sélection & contrôle",
              text: "Nettoyage, vérification, photos réelles et mesure exacte de chaque pièce avant mise en ligne.",
            },
            {
              step: "03",
              icon: Boxes,
              title: "Mise en ligne unique",
              text: "Une fiche par objet, quantité 1, jamais réapprovisionnée. Vendu aujourd’hui, absent demain.",
            },
          ].map((item, index) => (
            <Reveal key={item.step} delay={index * 0.08}>
              <div className="relative h-full overflow-hidden rounded-[32px] border border-border/70 bg-white p-7 shadow-soft">
                <span className="absolute right-6 top-5 font-display text-4xl font-black text-cream-300">
                  {item.step}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Nos engagements" title="Ce qui ne change jamais" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.06}>
              <div className="flex h-full gap-4 rounded-[28px] border border-border/70 bg-white p-6 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-100 text-gold-700">
                  <value.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-brand-900">{value.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {value.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="rounded-[36px] border border-border/70 bg-white px-6 py-12 text-center shadow-soft sm:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Nos origines
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            {FEATURED_COUNTRIES.map((code) => (
              <Link
                key={code}
                to={`${ctas.shop}?pays=${code}`}
                className="flex items-center gap-3 rounded-3xl border border-border/70 bg-cream-100 px-5 py-4 transition-all hover:-translate-y-1 hover:border-brand-300"
              >
                <span className="text-3xl">{COUNTRIES[code].flag}</span>
                <span className="text-left">
                  <span className="block font-display text-base font-bold text-brand-900">
                    {COUNTRIES[code].name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">Voir les pièces</span>
                </span>
              </Link>
            ))}
          </div>

          <StarRow className="mt-10" />
          <p className="mt-5 font-display text-2xl font-black text-brand-900">
            {SCARCITY_LINE}
          </p>
        </div>
      </section>
    </div>
  );
}
