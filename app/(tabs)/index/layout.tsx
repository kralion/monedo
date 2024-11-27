import { router, Stack } from "expo-router";
import { X } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Search Roomy",
          headerLargeTitle: true,
          headerTransparent: true,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          headerSearchBarOptions: {
            placeholder: "Search",
            autoFocus: true,
            cancelButtonText: "Cancelar",
          },
          headerRight: () => <ThemeToggle />,
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerTitle: "Modal",
          headerLargeTitle: true,
          headerRight: () => (
            <Pressable
              className="shadow shadow-foreground/5"
              onPress={() => router.back()}
            >
              <X size={24} className="w-4 h-4 text-foreground/70" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
