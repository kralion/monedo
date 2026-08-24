import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import AppBottomTabs from "@/components/layout/app-bottomtabs";
import { usePaymentStore } from "@/stores/payment";
import confetti from "canvas-confetti";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data, isPending } = authClient.useSession();
  const { isPayed, setIsPayed } = usePaymentStore();
  const navigate = useNavigate();
  const isSignedIn = !!data;

  console.log("[_authenticated] Rendering - isPending:", isPending, "isSignedIn:", isSignedIn, "data:", data);

  useEffect(() => {
    console.log("[_authenticated] useEffect - isPending:", isPending, "isSignedIn:", isSignedIn);
    if (!isPending && !isSignedIn) {
      console.log("[_authenticated] Redirecting to /sign-in");
      navigate({ to: "/sign-in" });
    }
  }, [isPending, isSignedIn, navigate]);

  useEffect(() => {
    if (isPayed) {
      confetti({ particleCount: 300, spread: 70, origin: { y: 0.6 } });
      const t = setTimeout(() => setIsPayed(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isPayed, setIsPayed]);

  if (isPending) {
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
      <AppBottomTabs />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
