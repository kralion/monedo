import { useAuth, useUser } from "@clerk/clerk-expo";
import { useHeaderHeight } from "@react-navigation/elements";
import { Info } from "lucide-react-native";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { ScrollView, View } from "react-native";

export default function Membership() {
  const { user: userData } = useUser();
  const { has } = useAuth();

  const headerHeight = useHeaderHeight();
  const dateFormatted = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const timeformatted = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  return (
    <ScrollView style={{ paddingTop: headerHeight }}>
      <View className="flex flex-col gap-6 p-3 items-center">
        <View className="flex flex-row gap-4 items-center">
          <Avatar alt="profile" className="bg-teal-500 align-middle w-36 h-36">
            <AvatarImage
              accessibilityLabel="avatar"
              src={require("../../assets/logo.png")}
            />
            <AvatarFallback className="bg-slate-500" />
          </Avatar>

          <View className="flex flex-col gap-4">
            <Text className="font-bold text-4xl">
              {has?.({ permission: "premium:plan" })
                ? "Plan Pro"
                : "Plan Gratuito"}
            </Text>

            <Text className="text-accent">
              Adquisición: <Text> {dateFormatted}</Text>
            </Text>
            <Text className="text-accent">
              Ciclo Facturación:{" "}
              <Text className="text-sm font-semibold">
                {has?.({ permission: "premium:plan" }) ? "20/12" : "15/12"}
              </Text>
            </Text>
          </View>
        </View>
        {/* <Separator borderColor="$gray8" /> */}
        <View className="flex flex-col gap-4 rounded-xl">
          <View className="flex flex-row gap-2 items-center">
            <Info size={24} className="text-primary" />
            <Text className="text-3xl">Información del Plan</Text>
          </View>
          <View className="flex flex-col gap-4 p-4">
            <Text>
              Esta información es de caracter informativo y no puede ser editada
              o modificada. Se cauteloso con la información que compartas.
            </Text>

            <View className="flex flex-row gap-1 items-center">
              <Text className="text-accent">Titular de la cuenta: </Text>
              <Text className="font-bold">
                {userData?.firstName} {userData?.lastName}
              </Text>
            </View>
          </View>
        </View>
        {/* <Separator borderColor="$gray8" /> */}
        <Text className="text-3xl">Monto de Recargo</Text>
        <Button
          disabled
          size="lg"
          className={`
            ${
              has?.({ permission: "premium:plan" })
                ? "bg-green-900"
                : "bg-orange-10"
            }
            text-white
            `}
        >
          {has?.({ permission: "premium:plan" })
            ? "S/. 20.00 / mes"
            : "S/. 00.00 / mes"}
        </Button>
      </View>
    </ScrollView>
  );
}
