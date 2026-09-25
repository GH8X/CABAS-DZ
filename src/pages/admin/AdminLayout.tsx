import {
  LayoutDashboard,
  LogOut,
  Package,
  RotateCcw,
  Settings,
  ShoppingCart,
  Store,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LogoMark } from "@/components/brand/Logo";
import { StarGlyph } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ctas } from "@/lib/ctas";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/produits", label: "Produits", icon: Package, end: false },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingCart, end: false },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings, end: false },
];

export default function AdminLayout() {
  const { session, signOut, resetDemoData, orders } = useStore();
  const { toast } = useToast();
  const [navOpen, setNavOpen] = useState(false);

  const newOrders = orders.filter((order) => order.status === "NOUVELLE").length;

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setNavOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all",
              isActive
                ? "bg-brand-800 text-white shadow-soft"
                : "text-ink-soft hover:bg-brand-50 hover:text-brand-800",
            )
          }
        >
          <link.icon className="h-4 w-4" />
          {link.label}
          {link.to === "/admin/commandes" && newOrders > 0 ? (
            <span className="ml-auto rounded-full bg-gold-shine px-2 py-0.5 text-[10px] font-black text-brand-900">
              {newOrders}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-cream-100">
      <div className="mx-auto flex max-w-[1500px]">
        {/* sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r border-border/70 bg-white px-5 py-6 lg:flex">
          <Link to="/admin" className="flex items-center gap-3">
            <LogoMark />
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-black text-brand-900">
                CABAS DZ
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Administration
              </span>
            </span>
          </Link>

          <div className="mt-8 flex flex-1 flex-col">{nav}</div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border/70 pt-4">
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link to="/">
                <Store className="h-3.5 w-3.5" />
                Voir la boutique
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => {
                resetDemoData();
                toast({
                  title: "Données de démonstration restaurées",
                  description: "Le catalogue a été réinitialisé.",
                  tone: "info",
                });
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser la démo
            </Button>
          </div>

          <div className="mt-4 rounded-3xl bg-brand-900 p-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold-300">
              Connecté
            </p>
            <p className="mt-1 truncate text-sm font-bold">{session?.name}</p>
            <p className="truncate text-[11px] text-brand-200/80">{session?.email}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-start text-white hover:bg-white/10"
              onClick={signOut}
            >
              <LogOut className="h-3.5 w-3.5" />
              Se déconnecter
            </Button>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1">
          <header className="glass sticky top-0 z-30 border-b border-border/70">
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNavOpen((value) => !value)}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-white text-brand-800 lg:hidden"
                  aria-label="Ouvrir la navigation"
                >
                  <StarGlyph className="h-4 w-4" />
                </button>
                <div>
                  <p className="font-display text-lg font-black text-brand-900">
                    Tableau de bord
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Gestion des pièces uniques
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                  <Link to={ctas.shop}>Boutique</Link>
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={signOut} aria-label="Se déconnecter">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {navOpen ? (
              <div className="border-t border-border/70 px-4 py-4 lg:hidden">
                <div className="[&_a]:w-full">{nav}</div>
                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link to="/">
                    <Store className="h-3.5 w-3.5" />
                    Voir la boutique
                  </Link>
                </Button>
              </div>
            ) : null}
          </header>

          <main className="px-4 py-6 pb-24 sm:px-6 lg:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
