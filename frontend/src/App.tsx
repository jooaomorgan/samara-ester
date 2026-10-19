import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import StoreLayout from "./components/layout/StoreLayout";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import { AboutPage, ContactPage, ExchangesPage, NotFoundPage, PrivacyPage } from "./pages/InstitutionalPages";
import { CartProvider } from "./store/cart";
import { FavoritesProvider } from "./store/favorites";

const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminOverview = lazy(() => import("./admin/AdminOverview"));
const AdminProducts = lazy(() => import("./admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./admin/AdminProductForm"));
const AdminStock = lazy(() => import("./admin/AdminOperations").then((m) => ({ default: m.AdminStock })));
const AdminOrders = lazy(() => import("./admin/AdminOperations").then((m) => ({ default: m.AdminOrders })));
const AdminShipping = lazy(() => import("./admin/AdminOperations").then((m) => ({ default: m.AdminShipping })));

export default function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="p-10 text-sm text-ink-muted">Carregando…</div>}>
            <Routes>
              <Route element={<StoreLayout />}>
                <Route index element={<HomePage />} />
                <Route path=":categoria" element={<CategoryPage />} />
                <Route path="produto/:slug" element={<ProductPage />} />
                <Route path="busca" element={<SearchPage />} />
                <Route path="favoritos" element={<FavoritesPage />} />
                <Route path="carrinho" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="sobre" element={<AboutPage />} />
                <Route path="trocas-e-devolucoes" element={<ExchangesPage />} />
                <Route path="privacidade" element={<PrivacyPage />} />
                <Route path="contato" element={<ContactPage />} />
                <Route path="404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="produtos" element={<AdminProducts />} />
                <Route path="produtos/novo" element={<AdminProductForm />} />
                <Route path="produtos/:id" element={<AdminProductForm />} />
                <Route path="estoque" element={<AdminStock />} />
                <Route path="pedidos" element={<AdminOrders />} />
                <Route path="frete" element={<AdminShipping />} />
              </Route>
            </Routes>
          </Suspense>
          <Toaster position="bottom-center" toastOptions={{ className: "font-sans" }} />
        </BrowserRouter>
      </CartProvider>
    </FavoritesProvider>
  );
}
