import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/features/auth/hook/useAuth";
import PageLoader from "@/shared/ui/components/PageLoader";

export default function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <PageLoader />;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
