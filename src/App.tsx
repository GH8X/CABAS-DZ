import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ScrollToTop, SiteLayout } from "@/components/layout/SiteLayout";
import About from "@/pages/About";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminSettings from "@/pages/admin/AdminSettings";
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

export default function App() {
  return (
    <>
      <ScrollToTop />
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
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="produits/nouveau" element={<AdminProductForm />} />
          <Route path="produits/:id" element={<AdminProductForm />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="parametres" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
