import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Info } from "lucide-react-native";
import { SafeAreaView, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

export default function Membership() {
  const { user: userData } = useUser();
  const { has } = useAuth();

  const dateFormatted = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <SafeAreaView>
      <View className="flex flex-col gap-6 px-4 py-8 ">
        <View className="flex flex-row gap-4 items-center ">
          <Image
            source={require("../../../../assets/logo.png")}
            style={{ width: 100, height: 100 }}
          />

          <View className="flex flex-col gap-1">
            <Text className="font-bold text-xl">
              {has?.({ permission: "premium:plan" })
                ? "Plan Pro"
                : "Plan Gratuito"}
            </Text>

            <Text className="text-foreground">
              Adquisición: <Text> {dateFormatted}</Text>
            </Text>
            <Text className="text-foreground">
              Ciclo Facturación:{" "}
              <Text className="text-sm font-semibold">
                {has?.({ permission: "premium:plan" }) ? "20/12" : "15/12"}
              </Text>
            </Text>
          </View>
        </View>
        <Separator className="text-gray-500" />
        <View className="flex flex-col gap-4 rounded-xl">
          <View className="flex flex-row gap-2 items-center">
            <Info size={24} className="text-primary" />
            <Text className="text-xl">Información del Plan</Text>
          </View>
          <View className="flex flex-col gap-4 p-4">
            <Text>
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <View className="flex flex-row gap-1 items-center">
              <Text className="text-foreground">Titular de la cuenta: </Text>
              <Text className="font-bold">
                {userData?.firstName} {userData?.lastName}
              </Text>
            </View>
          </View>
        </View>
        <Separator className="text-gray-500" />

        <Text className="text-xl font-bold">Monto de Recargo</Text>
        <Button
          size="lg"
          className={`
            ${
              has?.({ permission: "premium:plan" })
                ? "bg-primary"
                : "bg-orange-500"
            }
            text-white
            `}
        >
          <Text>
            {has?.({ permission: "premium:plan" })
              ? "S/. 20.00 / mes"
              : "S/. 00.00 / mes"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
