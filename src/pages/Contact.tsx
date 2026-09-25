import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  Send,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { SectionHeading } from "@/components/brand/SectionHeading";
import { StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { whatsappLink } from "@/lib/format";
import { useStore } from "@/lib/store";

const FAQ = [
  {
    question: "Puis-je réserver une pièce ?",
    answer:
      "Oui. Écrivez-nous sur WhatsApp avec le nom de la pièce. Nous la passons en « Réservé » le temps de la confirmation. Réservation maintenue 24 h.",
  },
  {
    question: "Comment se passe la livraison ?",
    answer:
      "Nous livrons dans les 58 wilayas en 24 à 96 h. Le paiement se fait à la livraison, en espèces, directement au livreur.",
  },
  {
    question: "Pourquoi un seul exemplaire ?",
    answer:
      "CABAS DZ vend des pièces d'occasion importées d'Europe. Chaque objet existe en un seul exemplaire : une fois vendu, il ne revient jamais en stock.",
  },
  {
    question: "Les pièces sont-elles lavées ?",
    answer:
      "Tous les textiles sont nettoyés et les objets contrôlés avant la mise en ligne. Les défauts éventuels sont indiqués dans la description.",
  },
];

export default function Contact() {
  const { settings } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: "Merci de remplir votre nom et votre message.", tone: "error" });
      return;
    }
    const text = `Bonjour CABAS DZ,\n\nNom : ${form.name}\nTéléphone : ${form.phone || "—"}\n\n${form.message}`;
    window.open(whatsappLink(settings.whatsappNumber, text), "_blank", "noopener");
    toast({
      title: "Message prêt sur WhatsApp",
      description: "Envoyez-le pour que nous vous répondions.",
      tone: "success",
    });
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <div className="container py-10">
      <SectionHeading
        align="left"
        eyebrow="Contact"
        title="Parlons de votre prochaine trouvaille"
        subtitle="Une question sur une pièce, une réservation, un envoi ? Nous répondons rapidement, surtout sur WhatsApp."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-4">
          <a
            href={whatsappLink(
              settings.whatsappNumber,
              "Bonjour CABAS DZ, j'aimerais des informations.",
            )}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-center gap-4 rounded-[28px] bg-[#25D366] p-6 text-white shadow-lift transition-transform hover:-translate-y-1"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-white/20">
              <MessageCircle className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display text-xl font-black">
                Commander sur WhatsApp
              </span>
              <span className="mt-0.5 block text-sm text-white/85">
                Le moyen le plus rapide de nous joindre
              </span>
            </span>
          </a>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={<Phone className="h-5 w-5" />} label="Téléphone" value={settings.phone} />
            <InfoCard icon={<Mail className="h-5 w-5" />} label="Email" value={settings.email} />
            <InfoCard icon={<MapPin className="h-5 w-5" />} label="Atelier" value={settings.address} />
            <InfoCard
              icon={<Clock className="h-5 w-5" />}
              label="Horaires"
              value="Sam – Jeu · 9h à 18h"
            />
          </div>

          <div className="rounded-[28px] border border-border/70 bg-white p-6 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Suivez nos arrivages
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {settings.instagramUrl ? (
                <SocialButton href={settings.instagramUrl} label="Instagram">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </SocialButton>
              ) : null}
              {settings.facebookUrl ? (
                <SocialButton href={settings.facebookUrl} label="Facebook">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </SocialButton>
              ) : null}
              {settings.tiktokUrl ? (
                <SocialButton href={settings.tiktokUrl} label="TikTok">
                  <Music2 className="h-4 w-4" />
                  TikTok
                </SocialButton>
              ) : null}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Nos nouvelles pièces sont annoncées en premier sur Instagram — chaque publication
              correspond à une pièce unique.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-xl font-black text-brand-900">
            Envoyer un message
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Votre message sera préparé dans WhatsApp pour un envoi immédiat.
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-5">
            <div>
              <Label className="mb-2 block">Nom complet</Label>
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Votre nom"
              />
            </div>
            <div>
              <Label className="mb-2 block">Téléphone</Label>
              <Input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="0X XX XX XX XX"
                inputMode="tel"
              />
            </div>
            <div>
              <Label className="mb-2 block">Message</Label>
              <Textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                placeholder="Bonjour, je suis intéressé(e) par…"
                className="min-h-[140px]"
              />
            </div>
            <Button type="submit" size="lg" variant="default" className="w-full">
              <Send className="h-4 w-4" />
              Envoyer via WhatsApp
            </Button>
          </form>

          <div className="mt-8 rounded-3xl border border-border/70 bg-cream-100 p-5">
            <p className="text-sm font-bold text-brand-900">Livraison & paiement</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {settings.deliveryInfo}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <SectionHeading eyebrow="Questions fréquentes" title="Tout ce qu’il faut savoir" />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-[28px] border border-border/70 bg-white p-6 shadow-soft"
            >
              <p className="font-display text-base font-bold text-brand-900">{item.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
        <StarRow className="mt-12" />
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-border/70 bg-white p-5 shadow-soft">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </span>
      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-brand-900">{value}</p>
    </div>
  );
}

function SocialButton({
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
      className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-cream-100 px-4 py-2.5 text-xs font-bold text-brand-800 transition-all hover:-translate-y-0.5 hover:border-brand-300"
    >
      {children}
    </a>
  );
}
