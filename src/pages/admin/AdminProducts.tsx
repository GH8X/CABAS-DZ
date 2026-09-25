import {
  CheckCircle2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { StarGlyph } from "@/components/brand/Stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { CATEGORIES, categoryLabel } from "@/lib/constants";
import { formatDA, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "AVAILABLE", label: "Disponibles" },
  { value: "RESERVED", label: "Réservés" },
  { value: "SOLD", label: "Vendus" },
];

export default function AdminProducts() {
  const { products, setProductStatus, deleteProduct, restoreProduct } = useStore();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...products]
      .filter((product) => {
        if (status !== "all" && product.status !== status) return false;
        if (category !== "all" && product.category !== category) return false;
        if (term && !`${product.title} ${product.brand}`.toLowerCase().includes(term))
          return false;
        return true;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [products, query, status, category]);

  const markSold = (product: Product) => {
    setProductStatus(product.id, "SOLD");
    toast({
      title: "Produit marqué comme vendu",
      description: `${product.title} est retiré de la boutique.`,
      tone: "success",
    });
  };

  const markReserved = (product: Product) => {
    setProductStatus(product.id, "RESERVED");
    toast({ title: "Produit réservé", description: product.title, tone: "info" });
  };

  const restore = (product: Product) => {
    restoreProduct(product.id);
    toast({
      title: "Produit remis en vente",
      description: `${product.title} est de nouveau disponible.`,
      tone: "success",
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete.id);
    toast({ title: "Produit supprimé", description: pendingDelete.title, tone: "info" });
    setPendingDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-900">Produits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} produit{filtered.length > 1 ? "s" : ""} · quantité toujours égale à
            1
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/produits/nouveau">
            <Plus className="h-4 w-4" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 rounded-[28px] border border-border/70 bg-white p-4 shadow-soft sm:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-300" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un produit…"
            className="pl-11"
          />
        </div>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={STATUS_OPTIONS}
        />
        <Select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Toutes les catégories"
          options={CATEGORIES.map((item) => ({ value: item.id, label: item.label }))}
        />
      </div>

      <div className="rounded-[32px] border border-border/70 bg-white p-4 shadow-soft sm:p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="hidden md:table-cell">Pays</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-10 shrink-0 overflow-hidden rounded-xl bg-cream-200">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block max-w-[18rem] truncate text-sm font-bold text-brand-900">
                        {product.title}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <StarGlyph className="h-2.5 w-2.5 text-gold-400" />
                        {timeAgo(product.updatedAt)}
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-xs font-semibold text-ink-soft sm:table-cell">
                  {categoryLabel(product.category)}
                </TableCell>
                <TableCell className="whitespace-nowrap font-display text-sm font-black text-brand-900">
                  {formatDA(product.price)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <MiniFlag code={product.country} className="h-3.5 w-5" />
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
                    {product.status === "AVAILABLE"
                      ? "Disponible"
                      : product.status === "RESERVED"
                        ? "Réservé"
                        : "Vendu"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon-sm" aria-label="Modifier">
                      <Link to={`/admin/produits/${product.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </Button>

                    {product.status !== "SOLD" ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => markSold(product)}
                        aria-label="Marquer comme vendu"
                        title="Marquer comme vendu"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-rose-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => restore(product)}
                        aria-label="Remettre en vente"
                        title="Remettre en vente"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                      </Button>
                    )}

                    {product.status === "AVAILABLE" ? (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => markReserved(product)}
                        aria-label="Marquer comme réservé"
                        title="Marquer comme réservé"
                      >
                        <StarGlyph className="h-3.5 w-3.5 text-gold-600" />
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPendingDelete(product)}
                      aria-label="Supprimer"
                      title="Supprimer"
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
                  <p className="text-sm font-semibold text-ink-soft">Aucun produit trouvé</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ajustez votre recherche ou ajoutez une nouvelle pièce.
                  </p>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-rose-500" />
              Supprimer ce produit ?
            </DialogTitle>
            <DialogDescription>
              « {pendingDelete?.title} » sera définitivement retiré du catalogue. Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
