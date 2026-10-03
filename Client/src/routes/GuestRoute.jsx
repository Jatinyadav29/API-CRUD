import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/features/auth/hook/useAuth";
import PageLoader from "@/shared/ui/components/PageLoader";

export default function GuestRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <PageLoader />;
  if (isAuthenticated) {
    const destination = location.state?.from?.pathname ?? "/";
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
}
