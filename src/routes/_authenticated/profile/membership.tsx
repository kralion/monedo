import { createFileRoute } from "@tanstack/react-router";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile/membership")({
  component: MembershipPage,
});

function MembershipPage() {
  const { planName, isPremium } = useUserPlan();

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <h1 className="mb-4 text-2xl font-bold">Membresía</h1>
      <div className="flex flex-col gap-4">
        <p>Plan actual: {planName}</p>
        {!isPremium && (
          <Link to="/buy-premium">
            <span className="text-primary font-semibold">Actualizar a Premium</span>
          </Link>
        )}
      </div>
    </div>
  );
}
