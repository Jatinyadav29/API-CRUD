import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import store from "@/app/store";
import queryClient from "@/config/queryClient";
import AppRoutes from "@/routes/AppRoutes";
import ScrollToTop from "@/shared/ui/components/ScrollToTop";
import useLenis from "@/shared/hook/useLenis";

function AppInner() {
  useLenis();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </Provider>
  );
}
