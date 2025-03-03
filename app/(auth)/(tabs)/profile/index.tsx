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
import { ScrollView } from "react-native";
import { Platform, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
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
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900  flex-1 web:md:max-w-4xl "
    >
      <View className="flex flex-col items-center mt-8">
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
      <View className="flex flex-col gap-4  mt-10 items-start ml-4 web:md:mt-12  ">
        <Separator />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/(tabs)/profile/personal-info")}
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800"
        >
          <User color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white font-semibold">Mis Datos</Text>
        </TouchableOpacity>
        <Separator />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/(tabs)/profile/categories")}
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800 "
        >
          <Bookmark color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white font-semibold">Categorías</Text>
        </TouchableOpacity>
        <Separator />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/(tabs)/profile/membership")}
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800"
        >
          <UserSquare2 color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white font-semibold">Membresía</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          onPress={() => router.push("/(auth)/(tabs)/profile/settings")}
          className="flex flex-row gap-3 px-5 web:md:py-4 web:md:hover:bg-zinc-100 web:md:dark:hover:bg-zinc-800 "
        >
          <Settings color={isDarkColorScheme ? "white" : "black"} />
          <Text className="dark:text-white font-semibold">Ajustes</Text>
        </TouchableOpacity>
        <Separator />
      </View>
      <Text className="text-muted-foreground opacity-40 mt-40 mx-10 text-sm dark:text-secondary">
        Logueado con {user?.emailAddresses[0].emailAddress}
      </Text>
      <Text className="text-muted-foreground opacity-40 dark:text-secondary   mx-10 text-sm">
        Versión 3.15.1
      </Text>

      <View className="absolute bottom-[80px] right-[-100px] w-[200px] h-[300px] rounded-xl rotate-[-30deg] bg-green-300 shadow-lg" />

      <View className="absolute bottom-[40px] right-[-100px] w-[200px] h-[300px] rounded-xl rotate-[-40deg]  bg-green-400 shadow-lg" />

      <View className="absolute bottom-[00px] right-[-100px] w-[200px] h-[300px] rounded-xl rotate-[-50deg] bg-primary shadow-lg" />
    </ScrollView>
  );
}
