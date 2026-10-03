import { Outlet } from "react-router";
import Navbar from "@/shared/ui/components/Navbar";
import Footer from "@/shared/ui/components/Footer";
import ErrorBoundary from "@/shared/ui/components/ErrorBoundary";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
