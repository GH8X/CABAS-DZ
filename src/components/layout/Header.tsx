import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { StarGlyph } from "@/components/brand/Stars";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/constants";
import { ctas } from "@/lib/ctas";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useCartDrawer } from "./CartDrawer";
import { SearchDialog } from "./SearchDialog";

const NAV = [
  { label: "Accueil", to: "/", match: (p: string) => p === "/" },
  { label: "Boutique", to: ctas.shop, match: (p: string) => p.startsWith("/boutique") },
  { label: "Nouveautés", to: ctas.newArrivals, match: (p: string) => p.startsWith("/nouveautes") },
  { label: "Unique Produit", to: ctas.unique, match: (p: string) => p.startsWith("/unique") },
  { label: "Vendu", to: ctas.sold, match: (p: string) => p.startsWith("/vendus") },
];

export function Header() {
  const { settings, cartCount, session } = useStore();
  const { setOpen: setCartOpen } = useCartDrawer();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* announcement marquee */}
      <div className="relative overflow-hidden bg-brand-900 py-2 text-gold-200">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap pr-10">
          {Array.from({ length: 2 }).map((_, block) => (
            <div key={block} className="flex gap-10">
              {Array.from({ length: 3 }).map((__, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                >
                  <StarGlyph className="h-2.5 w-2.5" />
                  {settings.announcement}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "glass border-border/70 shadow-soft"
            : "border-transparent bg-cream-100/80 backdrop-blur-md",
        )}
      >
        <div className="container flex h-[68px] items-center justify-between gap-4">
          <Logo siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.slice(0, 2).map((item) => (
              <NavLink key={item.to} {...item} pathname={location.pathname} />
            ))}

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft outline-none transition-colors hover:bg-brand-50 hover:text-brand-800 data-[state=open]:bg-brand-50 data-[state=open]:text-brand-800">
                Catégories
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="center"
                  sideOffset={10}
                  className="z-50 w-[560px] rounded-3xl border border-border/70 bg-cream-50 p-4 shadow-lift data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                >
                  <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Explorer par catégorie
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {CATEGORIES.map((category) => (
                      <DropdownMenu.Item key={category.id} asChild>
                        <Link
                          to={`/boutique?categorie=${category.id}`}
                          className="flex cursor-pointer flex-col gap-1 rounded-2xl px-3 py-3 outline-none transition-colors data-[highlighted]:bg-brand-50"
                        >
                          <span className="text-lg" aria-hidden="true">
                            {category.emoji}
                          </span>
                          <span className="text-sm font-bold text-brand-900">
                            {category.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {category.blurb}
                          </span>
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {NAV.slice(2).map((item) => (
              <NavLink key={item.to} {...item} pathname={location.pathname} />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-all hover:bg-brand-50 hover:text-brand-800"
              aria-label="Rechercher"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-all hover:bg-brand-50 hover:text-brand-800"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 ? (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-shine px-1 text-[10px] font-black text-brand-900 shadow-soft"
                >
                  {cartCount}
                </motion.span>
              ) : null}
            </button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden xl:inline-flex"
            >
              <Link to={session ? ctas.admin : ctas.auth}>
                {session ? (
                  <LayoutDashboard className="h-3.5 w-3.5" />
                ) : (
                  <UserRound className="h-3.5 w-3.5" />
                )}
                {session ? "Dashboard" : "Admin"}
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-all hover:bg-brand-50 hover:text-brand-800 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-[20px] w-[20px]" />
            </button>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="p-6">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Logo siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} />

          <div className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-bold transition-colors",
                  item.match(location.pathname)
                    ? "bg-brand-800 text-white"
                    : "text-brand-900 hover:bg-brand-50",
                )}
              >
                {item.label}
                <StarGlyph
                  className={cn(
                    "h-3 w-3",
                    item.match(location.pathname) ? "text-gold-300" : "text-gold-400",
                  )}
                />
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <p className="px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Catégories
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  to={`/boutique?categorie=${category.id}`}
                  className="flex items-center gap-2 rounded-2xl border border-border/70 bg-white px-3 py-3 text-sm font-bold text-brand-900 transition-all hover:-translate-y-0.5 hover:border-brand-300"
                >
                  <span aria-hidden="true">{category.emoji}</span>
                  <span className="truncate">{category.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-2">
            <Button asChild variant="gold" size="lg">
              <Link to={ctas.unique}>
                <Sparkles className="h-4 w-4" />
                Explorer les pièces uniques
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={session ? ctas.admin : ctas.auth}>
                <Tag className="h-4 w-4" />
                {session ? "Tableau de bord" : "Espace administrateur"}
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to={ctas.about}>
                <Store className="h-4 w-4" />
                Notre histoire
              </Link>
            </Button>
          </div>

          <div className="mt-auto flex items-center justify-center gap-1 pt-8 text-gold-400">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarGlyph key={index} className="h-3 w-3" />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function NavLink({
  label,
  to,
  match,
  pathname,
}: {
  label: string;
  to: string;
  match: (path: string) => boolean;
  pathname: string;
}) {
  const active = match(pathname);
  return (
    <Link
      to={to}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-brand-800 text-white shadow-soft"
          : "text-ink-soft hover:bg-brand-50 hover:text-brand-800",
      )}
    >
      {label}
    </Link>
  );
}
