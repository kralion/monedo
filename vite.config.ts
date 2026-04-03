import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  plugins: [
    devtools(),
    TanStackRouterVite({
      routesDirectory: "./app/routes",
      generatedRouteTree: "./app/routeTree.gen.ts",
    }),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      srcDirectory: "app",
      router: {
        routesDirectory: "routes",
        generatedRouteTree: "routeTree.gen.ts",
      },
    }),
    viteReact(),
  ],
});
