import { createFileRoute, Link } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { Bookmark, User, UserSquare2, Settings, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useColorScheme } from "~/lib/useColorScheme";

export const Route = createFileRoute("/_authenticated/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useUser();
  const { planName, isPremium } = useUserPlan();
  const { isDarkColorScheme } = useColorScheme();

  return (
    <div className="bg-white dark:bg-zinc-900 flex-1 max-w-4xl mx-auto overflow-y-auto pb-28">
      <div className="flex flex-col items-center mt-8">
        <Avatar className="bg-teal-500 self-center w-36 h-36 md:w-40 md:h-40">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="rounded-xl bg-slate-500" />
        </Avatar>
        <div className="flex flex-col gap-1 md:gap-2 md:mt-2">
          <Text className="font-bold text-2xl dark:text-white md:text-3xl text-center">
            {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
          </Text>
          <Badge
            className={`text-white py-2 rounded-full md:py-3 md:px-6 ${
              isPremium ? "bg-green-500" : "bg-orange-500"
            }`}
          >
            Cuenta {planName}
          </Badge>
        </div>
      </div>
      {!isPremium && (
        <Link
          to="/buy-premium"
          className="block m-4 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #41D29B, #2E865F)",
            maxHeight: 120,
          }}
        >
          <div className="flex flex-row items-center justify-between p-4">
            <div className="flex flex-col gap-4 w-4/5">
              <Text className="text-xl font-semibold text-white">Adquirir Pro</Text>
              <Text className="opacity-80 text-white text-sm">
                Para poder tener acceso a todas las funcionalidades premium.
              </Text>
            </div>
            <div className="bg-white/20 rounded-full p-2">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </Link>
      )}
      <div className="flex flex-col gap-4 mt-10 items-start m-4 py-4 md:mt-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        <Link
          to="/profile/personal-info"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <User className="w-5 h-5" />
          <Text className="font-semibold">Mis Datos</Text>
        </Link>
        <Separator />
        <Link
          to="/profile/categories"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <Bookmark className="w-5 h-5" />
          <Text className="font-semibold">Categorías</Text>
        </Link>
        <Separator />
        <Link
          to="/profile/membership"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <UserSquare2 className="w-5 h-5" />
          <Text className="font-semibold">Membresía</Text>
        </Link>
        <Separator />
        <Link
          to="/profile/settings"
          className="flex flex-row gap-3 px-5 py-4 w-full rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
          <Settings className="w-5 h-5" />
          <Text className="font-semibold">Ajustes</Text>
        </Link>
      </div>
      <Text className="text-muted-foreground opacity-40 text-center mt-10 mx-10 text-sm">
        Logueado con {user?.emailAddresses?.[0]?.emailAddress ?? ""}
      </Text>
      <Text className="text-muted-foreground opacity-40 text-center mx-10 text-sm">
        Versión 1.0.0
      </Text>
    </div>
  );
}
