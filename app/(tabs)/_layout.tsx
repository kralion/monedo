import Colors from "@/lib/constants";
import { Tabs } from "expo-router";
import { Image, useColorScheme } from "react-native";

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
        name="home"
        options={{
          title: "House",
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
        name="rooms"
        options={{
          title: "Rooms",
          tabBarIcon: ({ color, focused }) => (
            <Image
              style={{ width: 28, height: 28, tintColor: color }}
              source={{
                uri: focused
                  ? "https://api.iconify.design/google-material-icons:round-meeting-room-fill.svg"
                  : "https://api.iconify.design/google-material-icons:round-meeting-room.svg",
              }}
              alt="google"
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
