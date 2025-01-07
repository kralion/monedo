import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="membership"
        options={{
          title: "Plan Actual",
          headerBackTitle: "Perfil",
          headerTransparent: true,
          headerLargeTitle: true,
        }}
      />

      <Stack.Screen
        name="personal-info"
        options={{
          title: "Tus Datos",
          headerBackTitle: "Perfil",
          headerTransparent: true,
          headerLargeTitle: true,
        }}
      />

      <Stack.Screen
        name="buy-premium"
        options={{
          title: "Adquirir Premium",
          headerBackTitle: "Perfil",
          headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
          headerTransparent: Platform.OS === "android" ? false : true,
          headerStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          headerBackTitle: "Perfil",
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerSearchBarOptions: {
            placeholder: "Buscar ...",
            hideWhenScrolling: false,
            cancelButtonText: "Cancelar",
          },
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
}
