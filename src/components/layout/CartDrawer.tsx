import { AnimatePresence, motion } from "framer-motion";
import { Minus, ShoppingBag, Trash2 } from "lucide-react";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { MiniFlag } from "@/components/brand/CountryFlag";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { formatDA } from "@/lib/format";
import { useStore } from "@/lib/store";
import { ctas } from "@/lib/ctas";

interface CartDrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      <CartDrawer open={open} onOpenChange={setOpen} />
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer() {
  const context = useContext(CartDrawerContext);
  if (!context) throw new Error("useCartDrawer must be used inside <CartDrawerProvider>");
  return context;
}

function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { cartProducts, cartTotal, removeFromCart, addToCart, clearCart } = useStore();
  const { toast } = useToast();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0">
        <div className="border-b border-border/60 px-6 py-5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-600" />
            Mon panier
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
              {cartProducts.length}
            </span>
          </SheetTitle>
          <SheetDescription className="mt-1">
            Chaque pièce est unique — le panier ne réserve pas encore votre trouvaille.
          </SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-cream-200 text-brand-400">
                <ShoppingBag className="h-7 w-7" />
              </span>
              <p className="font-display text-lg font-bold text-brand-900">
                Votre cabas est vide
              </p>
              <p className="max-w-[16rem] text-sm text-muted-foreground">
                Nos trouvailles partent vite : ajoutez votre pièce avant qu'elle ne disparaisse.
              </p>
              <Button asChild variant="default" className="mt-2">
                <Link to={ctas.shop} onClick={() => onOpenChange(false)}>
                  Découvrir la boutique
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {cartProducts.map((product) => (
                  <motion.li
                    key={product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 rounded-3xl border border-border/70 bg-white p-3 shadow-soft"
                  >
                    <Link
                      to={`/produit/${product.id}`}
                      onClick={() => onOpenChange(false)}
                      className="h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream-200"
                    >
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/produit/${product.id}`}
                          onClick={() => onOpenChange(false)}
                          className="line-clamp-2 text-sm font-bold leading-snug text-brand-900 hover:text-brand-600"
                        >
                          {product.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Retirer ${product.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                        <MiniFlag code={product.country} className="h-3 w-4" />
                        <span>Unique · 1 exemplaire</span>
                      </div>
                      <p className="mt-2 font-display text-base font-black text-brand-900">
                        {formatDA(product.price)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {cartProducts.length > 0 ? (
          <div className="border-t border-border/60 bg-white/70 px-6 py-5">
            <div className="flex items-center justify-between text-sm font-semibold text-ink-soft">
              <span>Sous-total</span>
              <span className="font-display text-xl font-black text-brand-900">
                {formatDA(cartTotal)}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-gold-700">
              <Minus className="hidden h-3 w-3" />
              Paiement à la livraison · 58 wilayas
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild size="lg" variant="gold">
                <Link to={ctas.checkout} onClick={() => onOpenChange(false)}>
                  Commander maintenant
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearCart();
                  toast({ title: "Panier vidé", tone: "info" });
                }}
              >
                Vider le panier
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
