import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useNeonUser } from "@/hooks/useNeonUser";
import { useState } from "react";
import {
  Bookmark,
  User,
  UserSquare2,
  Settings,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import { authClient } from "@/auth";
import { Button } from "@/components/ui/button";
import { BuyPremiumModal } from "@/components/buy-premium";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUserPlan } from "@/hooks/useUserPlan";
import { Card } from "@/components/ui/card";
import { ProfileImageUpload } from "@/features/profile";

export const Route = createFileRoute("/_authenticated/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useNeonUser();
  const { planName, isPremium } = useUserPlan();
  const [buyPremiumOpen, setBuyPremiumOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    await authClient.signOut();
    navigate({ to: "/sign-in" });
  }

  return (
    <div className="bg-white dark:bg-zinc-900 flex-1 max-w-4xl mx-auto overflow-y-auto pb-28 p-4">
      <div className="flex flex-col items-center mt-8 gap-4">
        <ProfileImageUpload image={user?.image} userId={user?.id ?? ""} />
        <div className="flex flex-col items-center gap-2 md:mt-2">
          <h1 className="text-center text-xl font-bold dark:text-white md:text-3xl">
            {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          </h1>
          <Badge
            className={`text-white my-2 ${
              isPremium ? "bg-green-500" : "bg-orange-500"
            }`}
          >
            Cuenta {planName}
          </Badge>
        </div>
      </div>
      {!isPremium && (
        <>
          <Card
            className="rounded-xl overflow-hidden text-left py-2 px-4 "
            style={{
              background: "linear-gradient(135deg, #41D29B, #2E865F)",
              maxHeight: 120,
            }}
            onClick={() => setBuyPremiumOpen(true)}
          >
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-4 w-1/2">
                <h2 className="text-xl font-semibold text-white">
                  Adquirir Pro
                </h2>
                <p className="text-sm text-white opacity-80">
                  Para poder tener acceso a todas las funcionalidades premium.
                </p>
              </div>
              <div className="rounded-full bg-white/20 p-2">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </Card>
          <BuyPremiumModal
            open={buyPremiumOpen}
            onOpenChange={setBuyPremiumOpen}
          />
        </>
      )}
      <div className="flex flex-col gap-4 mt-10 items-start  bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        <Link
          to="/profile/personal-info"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <User className="w-5 h-5" />
          <span className="font-semibold">Mis Datos</span>
        </Link>
        <Separator />
        <Link
          to="/profile/categories"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <Bookmark className="w-5 h-5" />
          <span className="font-semibold">Categorías</span>
        </Link>
        <Separator />
        <Link
          to="/profile/membership"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <UserSquare2 className="w-5 h-5" />
          <span className="font-semibold">Membresía</span>
        </Link>
        <Separator />
        <Link
          to="/profile/settings"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <Settings className="w-5 h-5" />
          <span className="font-semibold">Ajustes</span>
        </Link>
      </div>
      <p className="mx-10 mt-10 text-center text-sm text-muted-foreground opacity-40">
        Logueado con {user?.email ?? ""}
      </p>
      <p className="mx-10 text-center text-sm text-muted-foreground opacity-40">
        Versión 1.0.0
      </p>
      <Button
        variant="outline"
        className="w-full mt-4"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar Sesión
      </Button>
    </div>
  );
}
