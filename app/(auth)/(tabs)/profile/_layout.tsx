import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import { X } from "lucide-react-native";
import React, { useRef } from "react";

import { Platform, View } from "react-native";
import AddCategory from "~/components/profile/add-category";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/lib/useColorScheme";

export default function Layout() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { isDarkColorScheme } = useColorScheme();

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
            headerTransparent: true,
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="t&c"
          options={{
            title: "Términos Legales",
            headerLargeTitle: true,
            headerLargeTitleShadowVisible: false,
            headerRight: () => (
              <Button
                variant="link"
                className="active:opacity-70"
                size="icon"
                onPress={() => {
                  router.back();
                }}
                hitSlop={20}
              >
                <X color={isDarkColorScheme ? "white" : "black"} />
              </Button>
            ),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="icon"
          options={{
            title: "Icono de la App",
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerRight: () => (
              <Button
                variant="link"
                className="active:opacity-70"
                size="icon"
                onPress={() => {
                  router.back();
                }}
                hitSlop={20}
              >
                <X color={isDarkColorScheme ? "white" : "black"} />
              </Button>
            ),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="feedback"
          options={{
            title: "Feedback",
            headerRight: () => (
              <Button
                variant="link"
                className="active:opacity-70"
                size="icon"
                onPress={() => {
                  router.back();
                }}
                hitSlop={20}
              >
                <X color={isDarkColorScheme ? "white" : "black"} />
              </Button>
            ),
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Configuración",
            headerShadowVisible: false,
            headerLargeTitle: true,
          }}
        />

        <Stack.Screen
          name="personal-info"
          options={{
            title: "Tus Datos",
            headerShadowVisible: false,
            headerLargeTitle: true,
          }}
        />

        <Stack.Screen
          name="buy-premium"
          options={{
            title: "Adquirir Premium",
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
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            title: "Notificaciones",
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
