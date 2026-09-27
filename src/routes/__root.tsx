import { useEffect } from "react";
import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/store/auth";
import { Toaster } from "sonner";
import "../styles.css";
import { seo } from "@/lib/seo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SWUpdateProvider } from "@/hooks/use-sw-update";
import UpdateAppDialog from "@/components/update-app";
import splashIcon from "@/assets/images/splash-icon.png";

const SPLASH_STYLES = `#splash-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#fff;transition:opacity .3s ease-out}#splash-screen.hide{opacity:0;pointer-events:none}#splash-screen img{width:120px;height:120px;animation:splash-pulse 3s ease-in-out infinite}.dark #splash-screen{background:#18181b}@keyframes splash-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.8}}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      ...seo({
        title: "Monedo",
        description: "Gestiona tu dinero desde el alcance de tu bolsillo.",
      }),
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Página no encontrada</p>
    </div>
  );
}

function RootComponent() {
  useEffect(() => {
    document.getElementById("splash-screen")?.classList.add("hide");
  }, []);

  return (
    <>
      <HeadContent />
      <style dangerouslySetInnerHTML={{ __html: SPLASH_STYLES }} />
      <div id="splash-screen">
        <img src={splashIcon} alt="" />
      </div>
      <SWUpdateProvider>
        <AuthProvider>
          <TooltipProvider>
            <Outlet />
            <Toaster position="top-center" richColors />
            <UpdateAppDialog />
          </TooltipProvider>
        </AuthProvider>
      </SWUpdateProvider>
    </>
  );
}
