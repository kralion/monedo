import { useAuth, useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Bookmark,
  CheckCircle,
  CheckCircle2,
  Crown,
  Settings,
  User,
  UserSquare2,
} from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView className="bg-white dark:bg-zinc-900 web:md:w-1/2 web:md:mx-auto justify-center  flex-1">
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
        {has?.({ permission: "org:premium:plan" }) && (
          <LinearGradient
            colors={["#41D29B", "#2E865F"]}
            style={{ marginTop: 10, borderRadius: 10, width: "100%" }}
          >
            <TouchableOpacity
              className="flex-row flex items-center justify-between  p-4"
              onPress={() => router.push("/(auth)/(tabs)/profile/buy-premium")}
            >
              <View className=" flex flex-col gap-4 w-4/5">
                <Text className="text-xl font-semibold text-white">
                  Adquirir Pro
                </Text>
                <Text className="opacity-80 text-white">
                  Para poder tener acceso a todas las funcionalidades premium.
                </Text>
              </View>
              <View className="bg-white/20 rounded-full p-2 ">
                <CheckCircle2 size={32} color="white" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )}

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
    </SafeAreaView>
  );
}
