import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  ScrollRestoration,
} from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useColorScheme } from "~/lib/useColorScheme";
import "~/global.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { colorScheme } = useColorScheme();

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <html lang="es" className={colorScheme}>
          <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Monedo</title>
            <HeadContent />
          </head>
          <body className="min-h-screen bg-background text-foreground">
            <Outlet />
            <Toaster position="top-center" richColors />
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
