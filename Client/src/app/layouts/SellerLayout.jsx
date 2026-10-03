import { Outlet, NavLink } from "react-router";
import Navbar from "@/shared/ui/components/Navbar";
import ErrorBoundary from "@/shared/ui/components/ErrorBoundary";

const subNavLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-neutral-900 text-white"
      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
  }`;

export default function SellerLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-6xl gap-2 px-4 py-2">
          <NavLink to="/seller/dashboard" end className={subNavLinkClass}>
            Products
          </NavLink>
          <NavLink to="/seller/products/new" className={subNavLinkClass}>
            Add product
          </NavLink>
        </nav>
      </div>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
