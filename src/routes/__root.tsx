import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/store/auth";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { seo } from "@/lib/seo";
import { TooltipProvider } from "@/components/ui/tooltip";

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
        description:
          "Controla tus gastos, presupuestos y estadísticas en un solo lugar.",
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
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
