import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CartDrawerProvider } from "./CartDrawer";
import { FloatingActions } from "./FloatingActions";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function SiteLayout() {
  return (
    <CartDrawerProvider>
      <div className="flex min-h-dvh flex-col bg-cream-100">
        <Header />
        <main className="flex-1 pb-28 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <MobileNav />
        <FloatingActions />
      </div>
    </CartDrawerProvider>
  );
}
