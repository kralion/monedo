import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error('Missing "#app" element in index.html');
}

createRoot(rootElement).render(<RouterProvider router={getRouter()} />);
