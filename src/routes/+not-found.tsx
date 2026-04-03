import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/+not-found")({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground mt-2">Página no encontrada</p>
    </div>
  );
}
