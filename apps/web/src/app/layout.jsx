import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import PageTracker from "../components/PageTracker";
import useThemeStore from "../stores/themeStore";
import useLanguageStore from "../stores/languageStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeInit() {
  const initTheme = useThemeStore((s) => s.initTheme);
  const initLang = useLanguageStore((s) => s.initLang);
  useEffect(() => {
    initTheme();
    initLang();
  }, [initTheme, initLang]);
  return null;
}

export default function RootLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(window.location.pathname.startsWith("/admin"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInit />
      <div className="min-h-screen bg-[#080705] text-white">
        {!isAdmin && <Header />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <FloatingWhatsApp />}
        {!isAdmin && <PageTracker />}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1510",
              border: "1px solid rgba(200,169,110,0.2)",
              color: "#fff",
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}
