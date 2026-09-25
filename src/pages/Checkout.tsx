import { ArrowRight, BadgeCheck, Banknote, Loader2, ShieldCheck, Truck } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarGlyph, StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { ctas } from "@/lib/ctas";
import { WILAYAS } from "@/lib/constants";
import { formatDA } from "@/lib/format";
import { useStore } from "@/lib/store";

interface FormState {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  note: string;
}

const EMPTY: FormState = {
  fullName: "",
  phone: "",
  wilaya: "",
  commune: "",
  address: "",
  note: "",
};

export default function Checkout() {
  const { cartProducts, cartTotal, placeOrder } = useStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.fullName.trim().length < 3) next.fullName = "Entrez votre nom complet.";
    if (form.phone.replace(/\D/g, "").length < 9)
      next.phone = "Entrez un numéro de téléphone valide.";
    if (!form.wilaya) next.wilaya = "Sélectionnez votre wilaya.";
    if (form.commune.trim().length < 2) next.commune = "Indiquez votre commune.";
    if (form.address.trim().length < 6) next.address = "Entrez une adresse complète.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (cartProducts.length === 0) {
      toast({ title: "Votre panier est vide", tone: "error" });
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    const result = placeOrder({
      fullName: form.fullName,
      phone: form.phone,
      wilaya: form.wilaya,
      commune: form.commune,
      address: form.address,
      note: form.note || undefined,
      items: cartProducts.map((product) => ({ productId: product.id })),
    });
    setSubmitting(false);

    if (!result.ok) {
      toast({ title: "Commande impossible", description: result.error, tone: "error" });
      return;
    }

    toast({
      title: "Commande enregistrée",
      description: `Référence ${result.order.reference}`,
      tone: "success",
    });
    navigate(`/commande/confirmee/${result.order.id}`);
  };

  if (cartProducts.length === 0) {
    return (
      <div className="container py-16">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-[36px] border border-dashed border-brand-200 bg-white/70 px-8 py-16 text-center">
          <StarRow />
          <h1 className="mt-4 font-display text-2xl font-black text-brand-900">
            Aucune pièce à commander
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ajoutez une pièce unique à votre panier pour passer commande.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to={ctas.shop}>Voir la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <SectionHeading
        align="left"
        eyebrow="Commande"
        title="Finalisez votre commande"
        subtitle="Paiement à la livraison. Aucun paiement en ligne n'est nécessaire — vous réglez à la réception."
      />

      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft sm:p-7">
            <h2 className="font-display text-lg font-black text-brand-900">
              Vos informations
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Nous vous appelons pour confirmer avant expédition.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Nom & prénom"
                required
                error={errors.fullName}
                className="sm:col-span-2"
              >
                <Input
                  value={form.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  placeholder="Ex. Amina Belkacem"
                  autoComplete="name"
                />
              </Field>

              <Field label="Téléphone" required error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="0X XX XX XX XX"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>

              <Field label="Wilaya" required error={errors.wilaya}>
                <Select
                  value={form.wilaya}
                  onChange={(event) => update("wilaya", event.target.value)}
                  placeholder="Sélectionnez une wilaya"
                  options={WILAYAS.map((wilaya) => ({ value: wilaya, label: wilaya }))}
                />
              </Field>

              <Field label="Commune" required error={errors.commune}>
                <Input
                  value={form.commune}
                  onChange={(event) => update("commune", event.target.value)}
                  placeholder="Ex. Hydra"
                />
              </Field>

              <Field label="Adresse complète" required error={errors.address}>
                <Input
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  placeholder="Rue, numéro, cité, repère…"
                />
              </Field>

              <Field label="Note (optionnel)" className="sm:col-span-2">
                <Textarea
                  value={form.note}
                  onChange={(event) => update("note", event.target.value)}
                  placeholder="Un détail à nous communiquer ? (heure d'appel, repère de livraison…)"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft sm:p-7">
            <h2 className="font-display text-lg font-black text-brand-900">
              Mode de paiement
            </h2>
            <div className="mt-4 flex items-start gap-4 rounded-3xl border-2 border-brand-800 bg-brand-50/60 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-800 text-white">
                <Banknote className="h-5 w-5" />
              </span>
              <div>
                <p className="flex items-center gap-2 font-bold text-brand-900">
                  Paiement à la livraison
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vous payez en espèces au livreur, une fois la pièce reçue. Disponible dans les
                  58 wilayas.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, text: "Livraison 24–96 h" },
                { icon: ShieldCheck, text: "Pièce vérifiée" },
                { icon: StarGlyph, text: "Produit unique" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 rounded-2xl border border-border/70 bg-cream-100 px-3.5 py-3 text-xs font-semibold text-ink-soft"
                >
                  <item.icon className="h-4 w-4 text-brand-600" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft">
            <h2 className="font-display text-lg font-black text-brand-900">
              Votre commande
            </h2>

            <ul className="mt-5 flex flex-col gap-3">
              {cartProducts.map((product) => (
                <li key={product.id} className="flex gap-3">
                  <span className="h-16 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream-200">
                    {product.images[0] ? (
                      <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-bold leading-snug text-brand-900">
                      {product.title}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                      <MiniFlag code={product.country} className="h-3 w-4" />
                      {product.condition}
                    </span>
                  </span>
                  <span className="shrink-0 font-display text-sm font-black text-brand-900">
                    {formatDA(product.price)}
                  </span>
                </li>
              ))}
            </ul>

            <Separator className="my-5" />

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between text-ink-soft">
                <span>Sous-total</span>
                <span className="font-semibold">{formatDA(cartTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-ink-soft">
                <span>Livraison</span>
                <span className="font-semibold text-brand-700">À définir selon wilaya</span>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Total à payer
              </span>
              <span className="font-display text-2xl font-black text-brand-900">
                {formatDA(cartTotal)}
              </span>
            </div>

            <Button type="submit" size="xl" variant="gold" className="mt-6 w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Confirmer la commande
            </Button>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              En confirmant, vos pièces uniques sont immédiatement marquées comme vendues et
              retirées du catalogue.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  error,
  className,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </Label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}
