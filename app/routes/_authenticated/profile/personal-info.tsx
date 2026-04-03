import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
export const Route = createFileRoute("/_authenticated/profile/personal-info")({
  component: PersonalInfoPage,
});

function PersonalInfoPage() {
  const { user } = useUser();

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <h1 className="mb-4 text-2xl font-bold">Mis Datos</h1>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-muted-foreground">
          {user?.emailAddresses?.[0]?.emailAddress}
        </p>
      </div>
    </div>
  );
}
