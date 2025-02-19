import Colors from "@/lib/constants";
import { Image } from "expo-image";
import { router, Tabs } from "expo-router";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { Platform, StyleSheet } from "react-native";
import { Button } from "~/components/ui/button";
import { Crown, Lock, Plus } from "lucide-react-native";
import { Text } from "~/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";

export default function TabLayout() {
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  const { user, isSignedIn } = useUser();

  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.NAV_THEME[colorScheme ?? "light"].tint,
          tabBarStyle: {
            height: 80,
            paddingTop: 10,
          },
          tabBarHideOnKeyboard: true,
          freezeOnBlur: true,
          headerShown: false,
          tabBarShowLabel: Platform.OS === "web" ? false : true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            headerShown: true,
            headerShadowVisible: false,
            headerBackground: () => <View className="h-64 w-full" />,
            headerStyle: {
              height: 120,
            },
            headerLeft: () => (
              <View className="flex-row gap-4 items-center p-4">
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
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
                  <Text className="font-bold">Hola, {user?.firstName} 👋</Text>
                </View>
              </View>
            ),
            headerRight: () => (
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
