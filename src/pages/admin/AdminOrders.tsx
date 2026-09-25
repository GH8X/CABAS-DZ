import {
  Eye,
  MapPin,
  Package,
  Phone,
  Search,
  StickyNote,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarGlyph } from "@/components/brand/Stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
} from "@/lib/constants";
import { formatDA, formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...orders]
      .filter((order) => {
        if (status !== "all" && order.status !== status) return false;
        if (
          term &&
          !`${order.customerName} ${order.phone} ${order.reference} ${order.wilaya}`
            .toLowerCase()
            .includes(term)
        )
          return false;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [orders, query, status]);

  const counts = useMemo(() => {
    const map = new Map<OrderStatus, number>();
    ORDER_STATUSES.forEach((item) => map.set(item, 0));
    orders.forEach((order) => map.set(order.status, (map.get(order.status) ?? 0) + 1));
    return map;
  }, [orders]);

  const changeStatus = (order: Order, next: OrderStatus) => {
    updateOrderStatus(order.id, next);
    setSelected((current) => (current ? { ...current, status: next } : current));
    toast({
      title: "Statut mis à jour",
      description: `${order.reference} → ${ORDER_STATUS_LABELS[next]}`,
      tone: "success",
    });
  };

  const remove = (order: Order) => {
    deleteOrder(order.id);
    setSelected(null);
    toast({ title: "Commande supprimée", description: order.reference, tone: "info" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-black text-brand-900">Commandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivez et faites évoluer le statut des commandes clients.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {ORDER_STATUSES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(status === item ? "all" : item)}
            className={cn(
              "rounded-[24px] border p-4 text-left transition-all hover:-translate-y-0.5",
              status === item
                ? "border-brand-800 bg-brand-800 text-white shadow-soft"
                : "border-border/70 bg-white shadow-soft",
            )}
          >
            <p
              className={cn(
                "font-display text-2xl font-black",
                status === item ? "text-gold-300" : "text-brand-900",
              )}
            >
              {counts.get(item) ?? 0}
            </p>
            <p
              className={cn(
                "mt-0.5 text-[11px] font-bold uppercase tracking-wider",
                status === item ? "text-brand-100/80" : "text-muted-foreground",
              )}
            >
              {ORDER_STATUS_LABELS[item]}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-3 rounded-[28px] border border-border/70 bg-white p-4 shadow-soft sm:grid-cols-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, téléphone, référence…"
            className="pl-11"
          />
        </div>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={[
            { value: "all", label: "Tous les statuts" },
            ...ORDER_STATUSES.map((item) => ({
              value: item,
              label: ORDER_STATUS_LABELS[item],
            })),
          ]}
        />
      </div>

      <div className="rounded-[32px] border border-border/70 bg-white p-4 shadow-soft sm:p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden sm:table-cell">Wilaya</TableHead>
              <TableHead className="hidden md:table-cell">Produits</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-brand-900">
                      {order.customerName}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                      {order.reference} · {formatDateTime(order.createdAt)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{order.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <p className="text-xs font-semibold text-ink-soft">{order.wilaya}</p>
                  <p className="text-[11px] text-muted-foreground">{order.commune}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    {order.items.slice(0, 3).map((item) => (
                      <span
                        key={item.productId}
                        className="h-9 w-8 overflow-hidden rounded-lg bg-cream-200"
                        title={item.title}
                      >
                        {item.image ? (
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                    ))}
                    {order.items.length > 3 ? (
                      <span className="text-[11px] font-bold text-muted-foreground">
                        +{order.items.length - 3}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap font-display text-sm font-black text-brand-900">
                  {formatDA(order.total)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={cn(
                        "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        ORDER_STATUS_STYLES[order.status],
                      )}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        changeStatus(order, event.target.value as OrderStatus)
                      }
                      className="w-[140px] rounded-xl border border-input bg-white px-2 py-1 text-[11px] font-semibold text-ink-soft"
                      aria-label={`Statut de ${order.reference}`}
                    >
                      {ORDER_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {ORDER_STATUS_LABELS[item]}
                        </option>
                      ))}
                    </select>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setSelected(order)}
                      aria-label="Voir la commande"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(order)}
                      aria-label="Supprimer la commande"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-14 text-center">
                  <p className="text-sm font-semibold text-ink-soft">Aucune commande</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Les nouvelles commandes apparaîtront ici automatiquement.
                  </p>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent size="lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  Commande {selected.reference}
                  <Badge
                    variant="outline"
                    className={cn("normal-case", ORDER_STATUS_STYLES[selected.status])}
                  >
                    {ORDER_STATUS_LABELS[selected.status]}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoBlock icon={<Phone className="h-3.5 w-3.5" />} label="Téléphone">
                  {selected.phone}
                </InfoBlock>
                <InfoBlock icon={<MapPin className="h-3.5 w-3.5" />} label="Wilaya / Commune">
                  {selected.wilaya} · {selected.commune}
                </InfoBlock>
                <InfoBlock icon={<Package className="h-3.5 w-3.5" />} label="Adresse">
                  {selected.address}
                </InfoBlock>
                <InfoBlock icon={<StarGlyph className="h-3.5 w-3.5" />} label="Paiement">
                  {selected.paymentMethod}
                </InfoBlock>
              </div>

              {selected.note ? (
                <InfoBlock icon={<StickyNote className="h-3.5 w-3.5" />} label="Note du client">
                  {selected.note}
                </InfoBlock>
              ) : null}

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Produits commandés
                </p>
                <ul className="mt-3 flex flex-col gap-3">
                  {selected.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center gap-3 rounded-3xl border border-border/70 bg-cream-100 p-3"
                    >
                      <span className="h-16 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream-200">
                        {item.image ? (
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-brand-900">
                          {item.title}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                          <MiniFlag code={item.country} className="h-3 w-4" />
                          {item.condition}
                        </span>
                      </span>
                      <span className="font-display text-sm font-black text-brand-900">
                        {formatDA(item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-brand-900 px-5 py-4 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-100/80">
                  Total de la commande
                </span>
                <span className="font-display text-2xl font-black text-gold-300">
                  {formatDA(selected.total)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((item) => (
                  <Button
                    key={item}
                    size="sm"
                    variant={selected.status === item ? "default" : "outline"}
                    onClick={() => changeStatus(selected, item)}
                  >
                    {ORDER_STATUS_LABELS[item]}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between gap-3 border-t border-border/70 pt-4">
                <Button variant="ghost" size="sm" onClick={() => remove(selected)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer la commande
                </Button>
                <p className="text-[11px] text-muted-foreground">
                  Créée le {formatDateTime(selected.createdAt)}
                </p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-cream-100 px-4 py-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-brand-900">{children}</p>
    </div>
  );
}
