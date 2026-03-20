import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { Text } from "~/components/ui/text";

export const Route = createFileRoute("/_authenticated/profile/personal-info")({
  component: PersonalInfoPage,
});

function PersonalInfoPage() {
  const { user } = useUser();

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Text className="text-2xl font-bold mb-4">Mis Datos</Text>
      <div className="flex flex-col gap-2">
        <Text className="text-muted-foreground">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-muted-foreground">
          {user?.emailAddresses?.[0]?.emailAddress}
        </Text>
      </div>
    </div>
  );
}
