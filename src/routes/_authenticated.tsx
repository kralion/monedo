import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { usePaymentStore } from "@/stores/payment";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isPayed, setIsPayed } = usePaymentStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: "/sign-in" });
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (isPayed) {
      confetti({ particleCount: 300, spread: 70, origin: { y: 0.6 } });
      const t = setTimeout(() => setIsPayed(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isPayed, setIsPayed]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
