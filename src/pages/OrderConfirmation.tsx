import { CheckCircle2, MessageCircle, Package, Phone, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarRow } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ctas } from "@/lib/ctas";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDA, formatDateTime, whatsappLink } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, settings } = useStore();
  const order = orders.find((item) => item.id === orderId);

  if (!order) {
    return (
      <div className="container py-20">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-[36px] border border-dashed border-brand-200 bg-white/70 px-8 py-16 text-center">
          <StarRow />
          <h1 className="mt-4 font-display text-2xl font-black text-brand-900">
            Commande introuvable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette référence n’existe pas ou a été supprimée.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link to={ctas.shop}>Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    );
  }

  const waMessage = `Bonjour CABAS DZ, je viens de passer la commande ${order.reference} (${formatDA(
    order.total,
  )}). Je confirme mon adresse : ${order.address}, ${order.commune}, ${order.wilaya}.`;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-[36px] bg-brand-900 px-6 py-12 text-center text-white sm:px-12">
          <div className="absolute inset-0 bg-eu-radial" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gold-shine text-brand-900">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-6 font-display text-3xl font-black sm:text-4xl">
              Commande confirmée !
            </h1>
            <p className="mt-3 text-sm text-brand-100/85">
              Merci {order.customerName.split(" ")[0]} — vos pièces uniques sont désormais
              marquées comme <strong className="text-gold-300">vendues</strong> et retirées du
              catalogue.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gold-200">
              Référence {order.reference}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-border/70 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-black text-brand-900">
              Récapitulatif
            </h2>
            <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <ul className="mt-6 flex flex-col gap-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-4">
                <span className="h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream-200">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <Link
                    to={`/produit/${item.productId}`}
                    className="line-clamp-2 text-sm font-bold leading-snug text-brand-900 hover:text-brand-600"
                  >
                    {item.title}
                  </Link>
                  <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    <MiniFlag code={item.country} className="h-3 w-4" />
                    {item.condition} · Vendu
                  </span>
                </span>
                <span className="shrink-0 font-display text-sm font-black text-brand-900">
                  {formatDA(item.price)}
                </span>
              </li>
            ))}
          </ul>

          <Separator className="my-6" />

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="Téléphone" value={order.phone} icon={<Phone className="h-3.5 w-3.5" />} />
            <InfoRow
              label="Wilaya"
              value={`${order.wilaya} · ${order.commune}`}
              icon={<Package className="h-3.5 w-3.5" />}
            />
            <InfoRow label="Adresse" value={order.address} />
            <InfoRow label="Date" value={formatDateTime(order.createdAt)} />
            <InfoRow label="Paiement" value={order.paymentMethod} />
            <InfoRow label="Total" value={formatDA(order.total)} />
          </div>

          {order.note ? (
            <div className="mt-5 rounded-2xl border border-border/70 bg-cream-100 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Votre note
              </p>
              <p className="mt-1 text-sm text-ink-soft">{order.note}</p>
            </div>
          ) : null}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="flex-1 bg-[#25D366] text-white hover:bg-[#1eb356]"
            >
              <a
                href={whatsappLink(settings.whatsappNumber, waMessage)}
                target="_blank"
                rel="noreferrer noopener"
              >
                <MessageCircle className="h-4 w-4" />
                Confirmer sur WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link to={ctas.shop}>
                <ShoppingBag className="h-4 w-4" />
                Continuer mes trouvailles
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-gold-200 bg-gold-50 px-6 py-5 text-center">
          <p className="text-sm font-bold text-gold-800">
            Nous vous appelons dans les prochaines heures pour confirmer la livraison.
          </p>
          <p className="mt-1 text-xs text-gold-700/80">
            Besoin d’aide ? Écrivez-nous sur WhatsApp au {settings.whatsappNumber}.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-cream-100 px-4 py-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-brand-900">{value}</p>
    </div>
  );
}
