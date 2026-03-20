import { createFileRoute } from "@tanstack/react-router";
import { Text } from "~/components/ui/text";
import { useUserPlan } from "~/hooks/useUserPlan";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/membership")({
  component: MembershipPage,
});

function MembershipPage() {
  const { planName, isPremium } = useUserPlan();

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Text className="text-2xl font-bold mb-4">Membresía</Text>
      <div className="flex flex-col gap-4">
        <Text>Plan actual: {planName}</Text>
        {!isPremium && (
          <Link to="/buy-premium">
            <span className="text-primary font-semibold">Actualizar a Premium</span>
          </Link>
        )}
      </div>
    </div>
  );
}
