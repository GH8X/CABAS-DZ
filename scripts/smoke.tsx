/**
 * Server-render smoke test.
 *
 * Renders every route (storefront + admin pages) with react-dom/server so that
 * render-time crashes, bad imports and empty screens surface without a browser.
 * Run with: bun run scripts/smoke.tsx
 */
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ToastProvider } from "@/components/ui/toast";
import { StoreProvider } from "@/lib/store";
import About from "@/pages/About";
import Auth from "@/pages/Auth";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import NewArrivals from "@/pages/NewArrivals";
import NotFound from "@/pages/NotFound";
import OrderConfirmation from "@/pages/OrderConfirmation";
import ProductDetail from "@/pages/ProductDetail";
import Shop from "@/pages/Shop";
import Sold from "@/pages/Sold";
import UniqueProduit from "@/pages/UniqueProduit";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminSettings from "@/pages/admin/AdminSettings";

function Storefront() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/boutique" element={<Shop />} />
        <Route path="/nouveautes" element={<NewArrivals />} />
        <Route path="/unique" element={<UniqueProduit />} />
        <Route path="/vendus" element={<Sold />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/commande" element={<Checkout />} />
        <Route path="/commande/confirmee/:orderId" element={<OrderConfirmation />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

/** Admin pages rendered directly, so each screen is exercised individually. */
function AdminPages() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="produits" element={<AdminProducts />} />
        <Route path="produits/nouveau" element={<AdminProductForm />} />
        <Route path="produits/:id" element={<AdminProductForm />} />
        <Route path="commandes" element={<AdminOrders />} />
        <Route path="parametres" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

/** Verifies the route guard keeps signed-out visitors away from /admin. */
function Guarded() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

type Expectation = "page" | "guard";

const CASES: Array<{ url: string; label: string; expect?: Expectation }> = [
  { url: "/", label: "Accueil" },
  { url: "/boutique", label: "Boutique" },
  { url: "/boutique?pays=DE&categorie=vetements&statut=all&tri=price-asc&min=1000&max=9000", label: "Boutique + filtres" },
  { url: "/boutique?q=cuir&etat=Tr%C3%A8s%20bon%20%C3%A9tat", label: "Boutique + recherche" },
  { url: "/nouveautes", label: "Nouveautés" },
  { url: "/unique", label: "Unique Produit" },
  { url: "/vendus", label: "Vendus" },
  { url: "/produit/p_veste_cuir_marron", label: "Produit (disponible)" },
  { url: "/produit/p_sac_cuir_grane", label: "Produit (réservé)" },
  { url: "/produit/p_jean_levis", label: "Produit (vendu)" },
  { url: "/produit/inexistant", label: "Produit (introuvable)" },
  { url: "/panier", label: "Panier" },
  { url: "/commande", label: "Commande" },
  { url: "/commande/confirmee/ord_1", label: "Confirmation" },
  { url: "/a-propos", label: "À propos" },
  { url: "/contact", label: "Contact" },
  { url: "/auth", label: "Auth" },
  { url: "/auth?returnTo=%2Fadmin%2Fcommandes", label: "Auth (returnTo)" },
  { url: "/page-inconnue", label: "404" },
  { url: "/admin", label: "Garde /admin", expect: "guard" },
  { url: "/admin", label: "Admin · tableau de bord", expect: "page" },
  { url: "/admin/produits", label: "Admin · produits", expect: "page" },
  { url: "/admin/produits/nouveau", label: "Admin · nouveau produit", expect: "page" },
  { url: "/admin/produits/p_veste_cuir_marron", label: "Admin · édition produit", expect: "page" },
  { url: "/admin/commandes", label: "Admin · commandes", expect: "page" },
  { url: "/admin/parametres", label: "Admin · paramètres", expect: "page" },
];

function render(view: "storefront" | "adminPages" | "guarded", url: string) {
  const [pathname, search] = url.split("?");
  return renderToString(
    <MemoryRouter initialEntries={[{ pathname, search: search ? `?${search}` : "" }]}>
      <StoreProvider>
        <ToastProvider>
          {view === "storefront" ? (
            <Storefront />
          ) : view === "adminPages" ? (
            <AdminPages />
          ) : (
            <Guarded />
          )}
        </ToastProvider>
      </StoreProvider>
    </MemoryRouter>,
  );
}

let failures = 0;
const warnings = console.error;
console.error = () => undefined; // silence expected useLayoutEffect SSR notices

for (const testCase of CASES) {
  const isGuard = testCase.expect === "guard";
  const view = isGuard ? "guarded" : testCase.label.startsWith("Admin") ? "adminPages" : "storefront";
  try {
    const html = render(view, testCase.url);
    if (isGuard) {
      // The guard must not render the dashboard for a signed-out visitor.
      if (html.length < 400 && !html.includes("Tableau de bord")) {
        console.log(`OK     ${testCase.label.padEnd(28)} redirigé vers /auth`);
      } else {
        failures += 1;
        console.log(`FAIL   ${testCase.label} — dashboard leaked (${html.length} bytes)`);
      }
      continue;
    }
    if (html.length < 2000) {
      failures += 1;
      console.log(`EMPTY  ${testCase.label.padEnd(28)} ${html.length} bytes`);
    } else {
      console.log(`OK     ${testCase.label.padEnd(28)} ${String(html.length).padStart(7)} bytes`);
    }
  } catch (error) {
    failures += 1;
    console.log(
      `FAIL   ${testCase.label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

console.error = warnings;
console.log(failures === 0 ? "\nALL ROUTES OK" : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
