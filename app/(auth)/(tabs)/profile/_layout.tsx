import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useCallback, useRef } from "react";

import { Platform, Button as NativeButton, View } from "react-native";
import AddCategory from "~/components/profile/add-category";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Layout() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <View className="flex-1">
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
          name="settings"
          options={{
            title: "Configuración",
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
          name="categories"
          options={{
            title: "Categorías",
            headerBackTitle: "Perfil",
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerSearchBarOptions: {
              placeholder: "Buscar ...",
              hideWhenScrolling: false,
              cancelButtonText: "Cancelar",
            },
            headerLargeTitleShadowVisible: false,
            headerRight: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Agregar"
                  color="#27BE8B"
                  onPress={() => {
                    bottomSheetRef.current?.expand();
                  }}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => {
                    bottomSheetRef.current?.expand();
                  }}
                >
                  <Text>Agregar</Text>
                </Button>
              );
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
      <AddCategory bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
