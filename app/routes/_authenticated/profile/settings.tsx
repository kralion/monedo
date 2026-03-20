import { createFileRoute } from "@tanstack/react-router";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <div className="max-w-xl mx-auto p-4 pb-28">
      <Text className="text-2xl font-bold mb-4">Ajustes</Text>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <Text>Tema</Text>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={colorScheme === "light" ? "default" : "outline"}
              onClick={() => setColorScheme("light")}
            >
              Claro
            </Button>
            <Button
              size="sm"
              variant={colorScheme === "dark" ? "default" : "outline"}
              onClick={() => setColorScheme("dark")}
            >
              Oscuro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
