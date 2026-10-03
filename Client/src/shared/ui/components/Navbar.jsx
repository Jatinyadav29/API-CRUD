import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { APP_NAME } from "@/config/constants";
import useAuth from "@/features/auth/hook/useAuth";
import Button from "@/shared/ui/components/Button";
import Skeleton from "@/shared/ui/components/Skeleton";

export default function Navbar() {
  const { user, isAuthenticated, isSeller, isInitializing, logout, status } =
    useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [trackedPath, setTrackedPath] = useState(pathname);

  if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const handleLogout = useCallback(async () => {
    try {
      navigate("/", { replace: true });
      await logout();
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed");
    }
  }, [logout, navigate]);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900"
    }`;

  function renderAuthArea() {
    if (isInitializing) {
      return <Skeleton className="h-8 w-24" />;
    }

    if (isAuthenticated) {
      return (
        <>
          {isSeller && (
            <NavLink to="/seller/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          <span className="text-sm text-neutral-600">{user.name}</span>
          <Button
            variant="ghost"
            loading={status === "loading"}
            onClick={handleLogout}
            className="text-sm"
          >
            Log out
          </Button>
        </>
      );
    }

    return (
      <>
        <Link to="/login">
          <Button variant="ghost" className="text-sm">
            Log in
          </Button>
        </Link>
        <Link to="/register">
          <Button className="text-sm">Register</Button>
        </Link>
      </>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-lg font-bold text-neutral-900 hover:text-neutral-700"
        >
          {APP_NAME}
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {renderAuthArea()}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-neutral-100 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">{renderAuthArea()}</div>
        </div>
      )}
    </header>
  );
}
