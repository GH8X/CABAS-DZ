import {
  Globe2,
  Instagram,
  LayoutTemplate,
  MessageCircle,
  RotateCcw,
  Save,
  Share2,
  Store,
  Truck,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarGlyph } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_SETTINGS } from "@/lib/seed";
import { whatsappLink } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { SiteSettings } from "@/lib/types";

const TABS = [
  { id: "identity", label: "Identité", icon: Store },
  { id: "homepage", label: "Page d'accueil", icon: LayoutTemplate },
  { id: "contact", label: "Contact & réseaux", icon: Share2 },
  { id: "content", label: "Contenu & livraison", icon: Truck },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminSettings() {
  const { settings, updateSettings } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [tab, setTab] = useState<TabId>("identity");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateSettings(form);
    toast({
      title: "Paramètres enregistrés",
      description: "Les informations du site sont à jour.",
      tone: "success",
    });
  };

  const reset = () => {
    setForm(DEFAULT_SETTINGS);
    updateSettings(DEFAULT_SETTINGS);
    toast({ title: "Paramètres réinitialisés", tone: "info" });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-900">Paramètres du site</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Toutes les informations affichées sur la boutique sont modifiables ici — rien n’est
            codé en dur.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Valeurs par défaut
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? "inline-flex items-center gap-2 rounded-full bg-brand-800 px-4 py-2.5 text-xs font-bold text-white shadow-soft"
                : "inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-4 py-2.5 text-xs font-bold text-ink-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
            }
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
          {tab === "identity" ? (
            <Section title="Identité de la boutique" icon={<Store className="h-4 w-4" />}>
              <Field label="Nom du site">
                <Input
                  value={form.siteName}
                  onChange={(event) => update("siteName", event.target.value)}
                />
              </Field>
              <Field label="Texte du logo">
                <Input
                  value={form.logoText}
                  onChange={(event) => update("logoText", event.target.value)}
                />
              </Field>
              <Field label="URL du logo (optionnel)">
                <Input
                  value={form.logoUrl}
                  onChange={(event) => update("logoUrl", event.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Slogan">
                <Input
                  value={form.tagline}
                  onChange={(event) => update("tagline", event.target.value)}
                />
              </Field>
              <Field label="Bandeau d'annonce (défilement en haut)">
                <Textarea
                  value={form.announcement}
                  onChange={(event) => update("announcement", event.target.value)}
                  className="min-h-[80px]"
                />
              </Field>
            </Section>
          ) : null}

          {tab === "homepage" ? (
            <Section title="Contenu de la page d'accueil" icon={<LayoutTemplate className="h-4 w-4" />}>
              <Field label="Titre principal (hero)">
                <Input
                  value={form.heroTitle}
                  onChange={(event) => update("heroTitle", event.target.value)}
                />
              </Field>
              <Field label="Sous-titre (hero)">
                <Textarea
                  value={form.heroSubtitle}
                  onChange={(event) => update("heroSubtitle", event.target.value)}
                  className="min-h-[80px]"
                />
              </Field>
              <Field label="Image principale (URL)">
                <Input
                  value={form.heroImage}
                  onChange={(event) => update("heroImage", event.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Titre de la section Unique Produit">
                <Input
                  value={form.uniqueTitle}
                  onChange={(event) => update("uniqueTitle", event.target.value)}
                />
              </Field>
              <Field label="Sous-titre Unique Produit">
                <Textarea
                  value={form.uniqueSubtitle}
                  onChange={(event) => update("uniqueSubtitle", event.target.value)}
                  className="min-h-[80px]"
                />
              </Field>
              <Field label="Texte « À propos »">
                <Textarea
                  value={form.aboutText}
                  onChange={(event) => update("aboutText", event.target.value)}
                  className="min-h-[110px]"
                />
              </Field>
              <Field label="Récit « De l'Europe à l'Algérie »">
                <Textarea
                  value={form.storyText}
                  onChange={(event) => update("storyText", event.target.value)}
                  className="min-h-[140px]"
                />
              </Field>
            </Section>
          ) : null}

          {tab === "contact" ? (
            <Section title="Contact & réseaux sociaux" icon={<Share2 className="h-4 w-4" />}>
              <Field
                label="Numéro WhatsApp"
                hint="Utilisé par tous les boutons « Commander sur WhatsApp »."
              >
                <Input
                  value={form.whatsappNumber}
                  onChange={(event) => update("whatsappNumber", event.target.value)}
                  placeholder="+213 555 12 34 56"
                />
              </Field>
              <Field label="Lien Instagram">
                <Input
                  value={form.instagramUrl}
                  onChange={(event) => update("instagramUrl", event.target.value)}
                  placeholder="https://instagram.com/…"
                />
              </Field>
              <Field label="Lien Facebook">
                <Input
                  value={form.facebookUrl}
                  onChange={(event) => update("facebookUrl", event.target.value)}
                  placeholder="https://facebook.com/…"
                />
              </Field>
              <Field label="Lien TikTok">
                <Input
                  value={form.tiktokUrl}
                  onChange={(event) => update("tiktokUrl", event.target.value)}
                  placeholder="https://tiktok.com/@…"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email">
                  <Input
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </Field>
                <Field label="Téléphone">
                  <Input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </Field>
              </div>
              <Field label="Adresse">
                <Input
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                />
              </Field>
            </Section>
          ) : null}

          {tab === "content" ? (
            <Section title="Livraison, footer et textes" icon={<Truck className="h-4 w-4" />}>
              <Field label="Informations de livraison">
                <Textarea
                  value={form.deliveryInfo}
                  onChange={(event) => update("deliveryInfo", event.target.value)}
                  className="min-h-[120px]"
                />
              </Field>
              <Field label="Texte du footer">
                <Input
                  value={form.footerText}
                  onChange={(event) => update("footerText", event.target.value)}
                />
              </Field>
            </Section>
          ) : null}
        </div>

        {/* live preview */}
        <aside className="flex flex-col gap-6 xl:sticky xl:top-24 xl:self-start">
          <div className="overflow-hidden rounded-[32px] border border-border/70 bg-white shadow-soft">
            <div className="relative h-40 w-full bg-brand-900">
              {form.heroImage ? (
                <img
                  src={form.heroImage}
                  alt=""
                  className="h-full w-full object-cover opacity-70"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 to-transparent" />
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-display text-lg font-black text-white">
                  {form.heroTitle || "Titre principal"}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-brand-100/80">
                  {form.heroSubtitle || "Sous-titre"}
                </p>
              </div>
            </div>
            <div className="p-5">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <MiniFlag code="EU" className="h-3.5 w-5" />
                Aperçu de la boutique
              </p>
              <p className="mt-3 font-display text-xl font-black text-brand-900">
                {form.siteName || "CABAS DZ"}
              </p>
              <p className="mt-1 text-xs italic text-muted-foreground">
                “{form.footerText || form.tagline}”
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <p className="flex items-center gap-2 font-display text-base font-bold text-brand-900">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Test WhatsApp
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Numéro actuel : <strong>{form.whatsappNumber || "non défini"}</strong>
            </p>
            {form.whatsappNumber ? (
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <a
                  href={whatsappLink(form.whatsappNumber, "Test CABAS DZ")}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Ouvrir la conversation de test
                </a>
              </Button>
            ) : null}
          </div>

          <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <p className="flex items-center gap-2 font-display text-base font-bold text-brand-900">
              <Globe2 className="h-4 w-4 text-brand-500" />
              Réseaux connectés
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-xs">
              <li className="flex items-center gap-2 text-ink-soft">
                <Instagram className="h-3.5 w-3.5 text-[#DD2A7B]" />
                {form.instagramUrl ? "Instagram configuré" : "Instagram non défini"}
              </li>
              <li className="flex items-center gap-2 text-ink-soft">
                <Share2 className="h-3.5 w-3.5 text-brand-500" />
                {form.facebookUrl ? "Facebook configuré" : "Facebook non défini"}
              </li>
              <li className="flex items-center gap-2 text-ink-soft">
                <StarGlyph className="h-3.5 w-3.5 text-gold-500" />
                {form.tiktokUrl ? "TikTok configuré" : "TikTok non défini"}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-lg font-black text-brand-900">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50 text-brand-700">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {hint ? <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
