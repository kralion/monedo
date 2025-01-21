import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Bell,
  Bookmark,
  Crown,
  Settings,
  Unlock,
  User,
  UserSquare2,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/lib/useColorScheme";
export default function ProfileScreen() {
  const { user } = useUser();
  const { has, signOut } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View>
        <View className="flex flex-col items-center">
          <Avatar className="bg-teal-500 self-center w-36 h-36" alt="avatar">
            <AvatarImage
              accessibilityLabel="avatar"
              source={{ uri: user?.imageUrl }}
            />
            <AvatarFallback className="rounded-xl bg-slate-500" />
          </Avatar>

          <View className="flex flex-col gap-1">
            <Text className="font-bold text-2xl dark:text-white">{`${user?.firstName} ${user?.lastName}`}</Text>
            <Badge
              className={` text-white py-2  rounded-full
                bg-${
                  has?.({ permission: "org:premium:plan" })
                    ? "green-500"
                    : "orange-500"
                }
                `}
            >
              <Text className="text-md">
                {`Cuenta ${
                  has?.({ permission: "org:premium:plan" }) ? "Premium" : "Free"
                }`}
              </Text>
            </Badge>
          </View>
        </View>
      </View>
      <View className="flex flex-col mt-10 items-start ml-4">
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/personal-info")}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3 px-5"
        >
          <User color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Mis Datos</Text>
        </Button>
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/buy-premium")}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3 px-5 "
        >
          <Crown color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Adquirir Premium</Text>
        </Button>
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/categories")}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3 px-5 "
        >
          <Bookmark color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Categorías</Text>
        </Button>
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/membership")}
          size="lg"
          className="flex flex-row gap-3 px-5"
          variant="ghost"
        >
          <UserSquare2 color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Membresía</Text>
        </Button>

        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/notifications")}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3 px-5"
        >
          <Bell color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Notificaciones</Text>
        </Button>

        <Button
          onPress={() => {
            router.push("/(auth)/(tabs)/profile/settings");
          }}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3  px-5"
        >
          <Settings color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Configuración</Text>
        </Button>
      </View>

      <Text className="text-muted-foreground opacity-40   mt-10 mx-10 text-sm dark:text-secondary">
        Logueado con {user?.emailAddresses[0].emailAddress}
      </Text>
      <Text className="text-muted-foreground opacity-40 dark:text-secondary   mx-10 text-sm">
        Versión 3.15.1
      </Text>

      <View className="absolute bottom-[100px] right-[-100px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-green-300 shadow-lg" />

      <View className="absolute bottom-[60px] right-[-100px] w-[200px] h-[300px] rounded-xl rotate-[-40deg]  bg-green-400 shadow-lg" />

      <View className="absolute bottom-[20px] right-[-100px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-primary shadow-lg" />
    </ScrollView>
  );
}
