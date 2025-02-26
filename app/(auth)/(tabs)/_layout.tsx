import Colors from "@/lib/constants";
import { useUser } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router, Tabs } from "expo-router";
import { Lock, Plus } from "lucide-react-native";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUserPlan } from "~/hooks/useUserPlan";

export default function TabLayout() {
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  const { user } = useUser();
  const { isPremium } = useUserPlan();

  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          animation: "shift",
          headerShown: false,
          lazy: true,
          tabBarActiveTintColor: Colors.NAV_THEME[colorScheme ?? "light"].tint,
          tabBarStyle: {
            position: "absolute",
            backgroundColor:
              colorScheme === "dark"
                ? "black"
                : Platform.select({
                    ios: "transparent",
                    android: "rgba(255, 255, 255, 1)",
                  }),
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: "rgba(0,0,0,0.2)",
            elevation: 0,
          },
          headerStyle: {
            height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
          tabBarHideOnKeyboard: true,
          freezeOnBlur: true,
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView
                tint={
                  colorScheme === "dark" ? "dark" : "systemThickMaterialLight"
                }
                intensity={70}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            headerTitle: () => null,
            headerShown: true,
            headerShadowVisible: false,
            headerBackground: () => <View className=" w-full" />,
            headerStyle: {
              height: 120,
            },
            headerLeft: () => (
              <View className="flex-row gap-4 items-center p-4">
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={{ width: 50, height: 50, borderRadius: 999 }}
                />
                <View className="flex flex-col">
                  <Text className="text-sm">
                    {capitalizeFirstLetter(
                      new Date().toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    )}
                  </Text>
                  <Text className="font-bold text-lg">
                    Hola, {user?.firstName} 👋
                  </Text>
                </View>
              </View>
            ),
            headerRight: () =>
              isPremium ? null : (
                <Button
                  className="mr-4 rounded-full"
                  size="icon"
                  onPress={() => router.push("/(auth)/(modals)/buy-premium")}
                >
                  <Lock size={18} color="white" />
                </Button>
              ),
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={{ width: 28, height: 28, tintColor: color }}
                source={{
                  uri: focused
                    ? "https://api.iconify.design/mingcute:home-4-fill.svg"
                    : "https://api.iconify.design/mingcute:home-4-line.svg",
                }}
                alt="google"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="statistics"
          options={{
            title: "Reportes",
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={{ width: 28, height: 28, tintColor: color }}
                source={{
                  uri: focused
                    ? "https://api.iconify.design/mingcute:chart-vertical-fill.svg"
                    : "https://api.iconify.design/mingcute:chart-vertical-line.svg",
                }}
                alt="google"
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Billetera",
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={{ width: 28, height: 28, tintColor: color }}
                source={{
                  uri: focused
                    ? "https://api.iconify.design/mingcute:wallet-4-fill.svg"
                    : "https://api.iconify.design/mingcute:wallet-4-line.svg",
                }}
                alt="google"
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerBackground: () => <View style={{ flex: 1 }} />,
            title: "Perfil",
            tabBarIcon: ({ color, focused }) => (
              <Image
                style={{ width: 28, height: 28, tintColor: color }}
                source={{
                  uri: focused
                    ? "https://api.iconify.design/mingcute:user-3-fill.svg"
                    : "https://api.iconify.design/mingcute:user-3-line.svg",
                }}
                alt="google"
              />
            ),
          }}
        />
      </Tabs>
      <TouchableOpacity
        className="absolute right-4 bottom-28 bg-primary p-4 h-16 w-16 rounded-full flex justify-center items-center shadow"
        onPress={() => router.push("/(auth)/(modals)/add-expense")}
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
