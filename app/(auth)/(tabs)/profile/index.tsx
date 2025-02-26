import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Bookmark,
  CheckCircle2,
  Settings,
  User,
  UserSquare2,
} from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUserPlan } from "~/hooks/useUserPlan";
import { useColorScheme } from "~/lib/useColorScheme";

export default function ProfileScreen() {
  const { user } = useUser();
  const { planName, isPremium } = useUserPlan();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const isMobile = Platform.OS !== "web";

  return (
    <SafeAreaView className="bg-white dark:bg-zinc-900  flex-1 web:md:max-w-4xl ">
      <View className="flex flex-col items-center web:md:mt-8">
        <Avatar
          className="bg-teal-500 self-center w-36 h-36 web:md:w-40 web:md:h-40"
          alt="avatar"
        >
          <AvatarImage
            accessibilityLabel="avatar"
            source={{ uri: user?.imageUrl }}
          />
          <AvatarFallback className="rounded-xl bg-slate-500" />
        </Avatar>

        <View className="flex flex-col gap-1 web:md:gap-2 web:md:mt-2">
          <Text className="font-bold text-2xl dark:text-white web:md:text-3xl text-center">{`${user?.firstName} ${user?.lastName}`}</Text>
          <Badge
            className={`text-white py-2 rounded-full web:md:py-3 web:md:px-6
                ${isPremium ? "bg-green-500" : "bg-orange-500"}
                `}
          >
            <Text className="text-md text-white web:md:text-lg">{`Cuenta ${planName}`}</Text>
          </Badge>
        </View>
      </View>
      {!isPremium && isMobile && (
        <LinearGradient
          colors={["#41D29B", "#2E865F"]}
          className="flex-1"
          style={{ margin: 16, borderRadius: 16, maxHeight: 120 }}
        >
          <TouchableOpacity
            className="flex-row flex items-center justify-between p-4"
            onPress={() => router.push("/(auth)/(modals)/buy-premium")}
          >
            <View className="flex flex-col gap-4 w-4/5">
              <Text className="text-xl font-semibold text-white">
                Adquirir Pro
              </Text>
              <Text className="opacity-80 text-white">
                Para poder tener acceso a todas las funcionalidades premium.
              </Text>
            </View>
            <View className="bg-white/20 rounded-full p-2">
              <CheckCircle2 size={32} color="white" />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      )}
      <View className="flex flex-col mt-10 items-start ml-4 web:md:mt-12  ">
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/personal-info")}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800 w-full"
        >
          <User color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Mis Datos</Text>
        </Button>

        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/categories")}
          size="lg"
          variant="ghost"
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800 w-full"
        >
          <Bookmark color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Categorías</Text>
        </Button>
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/membership")}
          size="lg"
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800 w-full"
          variant="ghost"
        >
          <UserSquare2 color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Membresía</Text>
        </Button>
        <Button
          onPress={() => router.push("/(auth)/(tabs)/profile/settings")}
          size="lg"
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800 w-full"
          variant="ghost"
        >
          <Settings color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white">Ajustes</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
