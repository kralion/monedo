import { router, Stack } from "expo-router";
import React from "react";
import { Button as NativeButton, Platform } from "react-native";
import AppProvider from "~/context/provider";

export default function ModalsLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen
          name="details/[id]"
          options={({ route }) => {
            const { id } = route.params as { id: string };
            return {
              title: "Detalles",
              headerBackTitle: "Gastos",
              headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
              headerTransparent: Platform.OS === "android" ? false : true,
              headerShadowVisible: false,
              headerRight: () => (
                <NativeButton
                  title="Editar"
                  color="#27BE8B"
                  onPress={() => router.push(`/(modals)/edit/${id}`)}
                />
              ),
            };
          }}
        />
        <Stack.Screen
          name="edit/[id]"
          options={{
            title: "Editar Gasto",
            headerBackTitle: "Detalles",
            headerLargeTitle: true,
            headerBlurEffect: Platform.OS === "android" ? "none" : "regular",
            headerTransparent: Platform.OS === "android" ? false : true,
            headerBackVisible: true,
            headerShadowVisible: false,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="buy-premium"
          options={{
            presentation: "modal",
            title: "Adquirir Premium",
            headerShown: true,
            headerShadowVisible: true,
            headerLeft: () => (
              <NativeButton
                title="Cancelar"
                color="#27BE8B"
                onPress={() => router.back()}
              />
            ),
          }}
        />
      </Stack>
    </AppProvider>
  );
}
