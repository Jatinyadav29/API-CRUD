import { Outlet } from "react-router";
import useAuth from "@/features/auth/hook/useAuth";
import PageLoader from "@/shared/ui/components/PageLoader";
import ForbiddenPage from "@/shared/ui/pages/ForbiddenPage";

export default function RoleRoute() {
  const { isSeller, isInitializing } = useAuth();

  if (isInitializing) return <PageLoader />;
  if (!isSeller) return <ForbiddenPage />;
  return <Outlet />;
}
