import Colors from "@/lib/constants";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { useColorScheme, View } from "react-native";
import AddExpenseIcon from "~/components/add-expense-icon";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerShown: false,
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
        name="add-expense"
        options={{
          title: "",
          tabBarIcon: () => <AddExpenseIcon />,
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
  );
}
