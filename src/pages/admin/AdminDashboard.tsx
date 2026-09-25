import {
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  Package,
  PackageCheck,
  Plus,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarGlyph } from "@/components/brand/Stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { categoryLabel, ORDER_STATUS_LABELS, STATUS_LABELS } from "@/lib/constants";
import { formatDA, formatDate, isNewArrival, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function AdminDashboard() {
  const { products, orders, availableProducts, soldProducts, reservedProducts } = useStore();

  const newProducts = products.filter((product) => isNewArrival(product.createdAt, 14));
  const revenue = soldProducts.reduce((sum, product) => sum + product.price, 0);
  const newOrders = orders.filter((order) => order.status === "NOUVELLE").length;

  const recentProducts = [...products]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6);

  const recentOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  const kpis = [
    {
      label: "Total produits",
      value: products.length,
      icon: Package,
      hint: "Toutes pièces confondues",
      tone: "bg-brand-50 text-brand-700",
    },
    {
      label: "Disponibles",
      value: availableProducts.length,
      icon: Boxes,
      hint: "En vente actuellement",
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Vendus",
      value: soldProducts.length,
      icon: PackageCheck,
      hint: "Déjà trouvés",
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: "Réservés",
      value: reservedProducts.length,
      icon: Clock3,
      hint: "En attente de confirmation",
      tone: "bg-gold-50 text-gold-700",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-900">Aperçu général</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chaque produit est unique — la quantité est toujours de 1.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/produits/nouveau">
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[28px] border border-border/70 bg-white p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${kpi.tone}`}>
                <kpi.icon className="h-5 w-5" />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-5 font-display text-3xl font-black text-brand-900">{kpi.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-700">
              {kpi.label}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{kpi.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[28px] border border-border/70 bg-brand-900 p-5 text-white shadow-soft">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-gold-300">
            <CircleDollarSign className="h-5 w-5" />
          </span>
          <p className="mt-5 font-display text-3xl font-black text-gold-300">
            {formatDA(revenue)}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-100/80">
            Valeur des pièces vendues
          </p>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-white p-5 shadow-soft">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
            <ShoppingCart className="h-5 w-5" />
          </span>
          <p className="mt-5 font-display text-3xl font-black text-brand-900">
            {orders.length}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Commandes totales
          </p>
          {newOrders > 0 ? (
            <Badge variant="gold" className="mt-3">
              {newOrders} nouvelle{newOrders > 1 ? "s" : ""}
            </Badge>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-border/70 bg-white p-5 shadow-soft">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-50 text-gold-700">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="mt-5 font-display text-3xl font-black text-brand-900">
            {newProducts.length}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            Nouveaux produits (14 j)
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[32px] border border-border/70 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-black text-brand-900">
                Produits récents
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Les dernières fiches ajoutées ou modifiées.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/produits">Tout gérer</Link>
            </Button>
          </div>

          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead className="hidden md:table-cell">Pays</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Link
                        to={`/admin/produits/${product.id}`}
                        className="flex items-center gap-3"
                      >
                        <span className="h-11 w-9 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-[16rem] truncate text-sm font-bold text-brand-900">
                            {product.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {timeAgo(product.updatedAt)}
                          </span>
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-xs font-semibold text-ink-soft sm:table-cell">
                      {categoryLabel(product.category)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-display text-sm font-black text-brand-900">
                      {formatDA(product.price)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <MiniFlag code={product.country} className="h-3.5 w-5" />
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "AVAILABLE"
                            ? "available"
                            : product.status === "RESERVED"
                              ? "reserved"
                              : "sold"
                        }
                      >
                        {STATUS_LABELS[product.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {recentProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Aucun produit pour le moment.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="rounded-[32px] border border-border/70 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-black text-brand-900">
                Dernières commandes
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Commandes clients récentes.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/commandes">Voir tout</Link>
            </Button>
          </div>

          <ul className="mt-5 flex flex-col gap-3">
            {recentOrders.map((order) => (
              <li
                key={order.id}
                className="rounded-3xl border border-border/70 bg-cream-100 px-4 py-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-brand-900">
                      {order.customerName}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
                      {order.reference} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-sm font-black text-brand-900">
                    {formatDA(order.total)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-brand-100 bg-white normal-case"
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {order.wilaya}
                  </span>
                </div>
              </li>
            ))}
            {recentOrders.length === 0 ? (
              <li className="rounded-3xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                Aucune commande pour le moment.
              </li>
            ) : null}
          </ul>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-gold-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarGlyph key={index} className="h-3 w-3" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
