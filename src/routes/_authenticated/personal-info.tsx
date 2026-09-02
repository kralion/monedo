import { createFileRoute, Link } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/personal-info")({
  component: PersonalInfoPage,
});

function PersonalInfoPage() {
  const { user } = useNeonUser();

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>
      <h1 className="mb-4 text-2xl font-bold">Mis Datos</h1>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-muted-foreground">
          {user?.email}
        </p>
      </div>
    </div>
  );
}
