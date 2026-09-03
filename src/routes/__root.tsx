import { useEffect } from "react";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/store/auth";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { seo } from "@/lib/seo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SWUpdateProvider } from "@/hooks/use-sw-update";
import UpdateAppDialog from "@/components/update-app";
import splashIcon from "@/assets/images/splash-icon.png";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Monedo",
        description: "Gestiona tu dinero desde el alcance de tu bolsillo.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#ffffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div>Page not found</div>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.getElementById("splash-screen")?.classList.add("hide");
  }, []);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style
          dangerouslySetInnerHTML={{
            __html: `#splash-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#fff;transition:opacity .3s ease-out}#splash-screen.hide{opacity:0;pointer-events:none}#splash-screen img{width:120px;height:120px;animation:splash-pulse 3s ease-in-out infinite}.dark #splash-screen{background:#18181b}@keyframes splash-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:.8}}`,
          }}
        />
        <HeadContent />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <div id="splash-screen">
          <img src={splashIcon} alt="" />
        </div>
        <SWUpdateProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-center" richColors />
              <UpdateAppDialog />
            </TooltipProvider>
          </AuthProvider>
        </SWUpdateProvider>
        <Scripts />
      </body>
    </html>
  );
}
