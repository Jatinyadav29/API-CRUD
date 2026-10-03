import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import PageLoader from "@/shared/ui/components/PageLoader";
import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";

const PublicLayout = lazy(() => import("@/app/layouts/PublicLayout"));
const AuthLayout = lazy(() => import("@/app/layouts/AuthLayout"));
const SellerLayout = lazy(() => import("@/app/layouts/SellerLayout"));

const LoginPage = lazy(() => import("@/features/auth/ui/pages/LoginPage"));
const RegisterPage = lazy(
  () => import("@/features/auth/ui/pages/RegisterPage"),
);

const ProductListPage = lazy(
  () => import("@/features/products/ui/pages/ProductListPage"),
);
const ProductDetailPage = lazy(
  () => import("@/features/products/ui/pages/ProductDetailPage"),
);
const SellerDashboardPage = lazy(
  () => import("@/features/products/ui/pages/SellerDashboardPage"),
);
const CreateProductPage = lazy(
  () => import("@/features/products/ui/pages/CreateProductPage"),
);
const EditProductPage = lazy(
  () => import("@/features/products/ui/pages/EditProductPage"),
);

const NotFoundPage = lazy(() => import("@/shared/ui/pages/NotFoundPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute />}>
            <Route element={<SellerLayout />}>
              <Route
                path="/seller/dashboard"
                element={<SellerDashboardPage />}
              />
              <Route
                path="/seller/products/new"
                element={<CreateProductPage />}
              />
              <Route
                path="/seller/products/:id/edit"
                element={<EditProductPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
