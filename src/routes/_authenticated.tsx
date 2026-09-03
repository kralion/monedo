import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/auth";
import { Sidebar } from "@/components/layout/sidebar";
import AppBottomTabs from "@/components/layout/app-bottomtabs";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const isSignedIn = !!data;

  useEffect(() => {
    if (!isPending && !isSignedIn) {
      navigate({ to: "/sign-in" });
    }
  }, [isPending, isSignedIn, navigate]);

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
