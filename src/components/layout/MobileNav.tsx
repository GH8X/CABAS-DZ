import { motion } from "framer-motion";
import { Grid2x2, Home, Search, ShoppingBag } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/constants";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useCartDrawer } from "./CartDrawer";
import { SearchDialog } from "./SearchDialog";
import { StarGlyph } from "@/components/brand/Stars";

export function MobileNav() {
  const { cartCount } = useStore();
  const { setOpen: setCartOpen } = useCartDrawer();
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="glass safe-bottom mx-3 mb-3 flex items-stretch justify-around rounded-3xl border border-border/70 px-2 pt-2 shadow-lift">
          <TabButton
            label="Accueil"
            icon={<Home className="h-5 w-5" />}
            active={location.pathname === "/"}
            to="/"
          />
          <TabButton
            label="Catégories"
            icon={<Grid2x2 className="h-5 w-5" />}
            active={location.pathname.startsWith("/boutique")}
            onClick={() => setCategoriesOpen(true)}
          />
          <TabButton
            label="Recherche"
            icon={<Search className="h-5 w-5" />}
            active={false}
            onClick={() => setSearchOpen(true)}
          />
          <TabButton
            label="Panier"
            icon={<ShoppingBag className="h-5 w-5" />}
            active={location.pathname.startsWith("/panier")}
            onClick={() => setCartOpen(true)}
            badge={cartCount}
          />
        </div>
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <Sheet open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] rounded-t-[32px] p-6">
          <SheetTitle className="flex items-center gap-2">
            <StarGlyph className="h-4 w-4 text-gold-400" />
            Toutes les catégories
          </SheetTitle>
          <div className="mt-5 grid grid-cols-2 gap-2 pb-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                to={`/boutique?categorie=${category.id}`}
                onClick={() => setCategoriesOpen(false)}
                className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-white px-4 py-4 transition-all active:scale-95"
              >
                <span className="text-xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="text-sm font-bold text-brand-900">{category.label}</span>
                <span className="text-[11px] text-muted-foreground">{category.blurb}</span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function TabButton({
  label,
  icon,
  active,
  to,
  onClick,
  badge,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  to?: string;
  onClick?: () => void;
  badge?: number;
}) {
  const content = (
    <span
      className={cn(
        "relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-bold transition-colors",
        active ? "text-brand-800" : "text-muted-foreground",
      )}
    >
      <span className="relative">
        {icon}
        {badge && badge > 0 ? (
          <motion.span
            key={badge}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-shine px-1 text-[9px] font-black text-brand-900"
          >
            {badge}
          </motion.span>
        ) : null}
      </span>
      {label}
      {active ? (
        <motion.span
          layoutId="mobile-nav-indicator"
          className="absolute -top-2 h-1 w-8 rounded-full bg-gold-shine"
        />
      ) : null}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="flex flex-1">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="flex flex-1">
      {content}
    </button>
  );
}
