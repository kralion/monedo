import { useAuth, useUser } from "@clerk/clerk-expo";
import { Bell, LogOut, Unlock, User, UserSquare2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function ProfileScreen() {
  const { user: userData } = useUser();
  const { has, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={{ paddingTop: 16, height: "100%" }}>
      <View>
        <View className="flex flex-col items-center">
          <Avatar className="bg-teal-500 self-center w-36 h-36" alt="avatar">
            <AvatarImage
              accessibilityLabel="avatar"
              src={userData?.imageUrl}
              style={{
                borderRadius: 100,
                width: 100,
                height: 100,
              }}
            />
            <AvatarFallback className="rounded-xl bg-slate-500" />
          </Avatar>

          <View className="flex flex-col gap-1">
            <Text>{`${userData?.firstName} ${userData?.lastName}`}</Text>
            <Button
              disabled
              size="sm"
              className={` text-white
                bg-${
                  has?.({ permission: "premium:plan" })
                    ? "green-500"
                    : "orange-500"
                }
                `}
            >
              {`Cuenta ${
                has?.({ permission: "premium:plan" }) ? "Premium" : "Free"
              }`}
            </Button>
          </View>
        </View>
      </View>
      <View className="flex flex-col mt-10 ml-3 items-start">
        <Button
          onPress={() => router.push("/(modals)/personal-info")}
          size="lg"
          className="flex flex-row gap-2"
        >
          <User />
          Mis Datos
        </Button>
        <Button
          onPress={() => router.push("/(modals)/membership")}
          size="lg"
          className="flex flex-row gap-2"
        >
          <UserSquare2 />
          Membresía
        </Button>
        <Button
          onPress={() => router.push("/(modals)/buy-premium")}
          size="lg"
          className="flex flex-row gap-2"
        >
          <Unlock />
          Adquirir Premium
        </Button>
        <Button
          onPress={() => router.push("/(modals)/notifications")}
          size="lg"
          className="flex flex-row gap-2"
        >
          <Bell />
          Notificaciones
        </Button>
        <Button
          onPress={() => {
            signOut();
            router.replace("/(auth)/sign-in");
          }}
          size="lg"
          variant="destructive"
          className="flex flex-row gap-2 "
        >
          <LogOut />
          Salir
        </Button>
      </View>

      <View className="absolute bottom-[70px] right-[-50px] w-[150px] h-[300px] rounded-[10px] rotate-[-20deg] bg-black shadow-lg" />

      <View className="absolute bottom-[30px] right-[-50px] w-[150px] h-[300px] rounded-[10px] rotate-[-30deg] bg-orange-500 shadow-lg" />

      <View className="absolute bottom-[-10px] right-[-50px] w-[150px] h-[300px] rounded-[10px] rotate-[-40deg] bg-green-400 shadow-lg" />
    </SafeAreaView>
  );
}
