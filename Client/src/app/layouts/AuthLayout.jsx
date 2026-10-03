import { Outlet, Link } from "react-router";
import { APP_NAME } from "@/config/constants";
import ErrorBoundary from "@/shared/ui/components/ErrorBoundary";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <div className="px-4 py-4">
        <Link
          to="/"
          className="text-lg font-bold text-neutral-900 hover:text-neutral-700"
        >
          {APP_NAME}
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
