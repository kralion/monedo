import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Info } from "lucide-react-native";
import { SafeAreaView, ScrollView, View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useUserPlan } from "~/hooks/useUserPlan";

export default function Membership() {
  const { user } = useUser();
  const { isPremium, planName } = useUserPlan();

  const dateFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto"
    >
      <View className="flex flex-col gap-6 px-4 py-8 ">
        <View className="flex flex-row gap-4 items-center ">
          <Image
            source={require("../../../../assets/logo.png")}
            style={{ width: 100, height: 100 }}
          />

          <View className="flex flex-col gap-1">
            <Text className="font-bold text-xl">Plan: {planName}</Text>

            <Text className="text-foreground">
              Adquisición: <Text> {dateFormatted}</Text>
            </Text>
            <Text className="text-foreground">
              Ciclo Facturación: <Text className="font-semibold">Mensual</Text>
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-4 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <View className="flex flex-row gap-2 items-center">
            <Info size={24} className="text-primary" />
            <Text className="text-lg">Información del Plan</Text>
          </View>
          <View className="flex flex-col gap-4 p-4 text-muted-foreground">
            <Text>
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <View className="flex flex-row gap-1 items-center">
              <Text className="text-foreground">Titular de la cuenta: </Text>
              <Text className="font-bold">
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-bold">Monto de Recargo</Text>
        <Button
          size="lg"
          onPress={() => router.push("/(auth)/(modals)/buy-premium")}
          disabled={isPremium}
        >
          <Text>{isPremium ? "S/ 20.00 / mes" : "S/ 00.00 / mes"}</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
