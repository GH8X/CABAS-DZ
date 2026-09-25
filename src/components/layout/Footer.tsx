import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarRow } from "@/components/brand/Stars";
import { CATEGORIES, FEATURED_COUNTRIES, COUNTRIES } from "@/lib/constants";
import { ctas } from "@/lib/ctas";
import { whatsappLink } from "@/lib/format";
import { useStore } from "@/lib/store";

const NAV_LINKS = [
  { label: "Accueil", to: "/" },
  { label: "Boutique", to: ctas.shop },
  { label: "Catégories", to: `${ctas.shop}?vue=categories` },
  { label: "Nouveautés", to: ctas.newArrivals },
  { label: "Unique Produit", to: ctas.unique },
  { label: "Vendus", to: ctas.sold },
  { label: "À propos", to: ctas.about },
  { label: "Contact", to: ctas.contact },
];

export function Footer() {
  const { settings } = useStore();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[40px] bg-brand-900 text-brand-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(700px 380px at 12% 0%, rgba(53,96,214,0.55), transparent 60%), radial-gradient(600px 340px at 92% 20%, rgba(245,193,66,0.22), transparent 62%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <div className="[&_span]:!text-white">
              <Logo siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} />
            </div>
            <p className="mt-5 max-w-xs font-display text-lg font-semibold italic text-gold-200">
              “{settings.footerText}”
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-200/80">
              {settings.aboutText}
            </p>
            <StarRow className="mt-6 justify-start" />
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold-300">
              Navigation
            </h4>
            <ul className="mt-5 flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm font-medium text-brand-100/85 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold-300">
              Nos origines
            </h4>
            <ul className="mt-5 flex flex-col gap-2.5">
              {FEATURED_COUNTRIES.map((code) => (
                <li key={code}>
                  <Link
                    to={`${ctas.shop}?pays=${code}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-100/85 transition-colors hover:text-gold-300"
                  >
                    <MiniFlag code={code} />
                    {COUNTRIES[code].flag} {COUNTRIES[code].name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={`${ctas.shop}?pays=EU`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-100/85 transition-colors hover:text-gold-300"
                >
                  <MiniFlag code="EU" />
                  Autres pays européens
                </Link>
              </li>
            </ul>

            <h4 className="mt-8 font-display text-sm font-bold uppercase tracking-wider text-gold-300">
              Catégories
            </h4>
            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`${ctas.shop}?categorie=${category.id}`}
                    className="text-xs font-medium text-brand-200/80 transition-colors hover:text-gold-300"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gold-300">
              Contact & réseaux
            </h4>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={whatsappLink(
                    settings.whatsappNumber,
                    "Bonjour CABAS DZ, j'ai une question.",
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-brand-100/85 transition-colors hover:text-gold-300"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  {settings.whatsappNumber}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-brand-100/85 transition-colors hover:text-gold-300"
                >
                  <Phone className="h-4 w-4 text-gold-300" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 text-brand-100/85 transition-colors hover:text-gold-300"
                >
                  <Mail className="h-4 w-4 text-gold-300" />
                  {settings.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-brand-100/85">
                <MapPin className="h-4 w-4 text-gold-300" />
                {settings.address}
              </li>
            </ul>

            <div className="mt-6 flex gap-2">
              {settings.instagramUrl ? (
                <SocialIcon href={settings.instagramUrl} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialIcon>
              ) : null}
              {settings.facebookUrl ? (
                <SocialIcon href={settings.facebookUrl} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialIcon>
              ) : null}
              {settings.tiktokUrl ? (
                <SocialIcon href={settings.tiktokUrl} label="TikTok">
                  <Music2 className="h-4 w-4" />
                </SocialIcon>
              ) : null}
              {settings.whatsappNumber ? (
                <SocialIcon
                  href={whatsappLink(settings.whatsappNumber, "Bonjour CABAS DZ !")}
                  label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </SocialIcon>
              ) : null}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gold-300">
                Livraison
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-brand-200/85">
                {settings.deliveryInfo}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center">
          <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-bold tracking-wide text-gold-200">
            🇪🇺 European Finds • 🇩🇿 Algerian Market
          </span>
          <p className="text-xs text-brand-200/70">
            © {year} {settings.siteName}. Toutes les pièces sont uniques — 1 seul exemplaire
            par produit.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/5 text-brand-100 transition-all hover:-translate-y-0.5 hover:border-gold-300/50 hover:text-gold-300"
    >
      {children}
    </a>
  );
}
