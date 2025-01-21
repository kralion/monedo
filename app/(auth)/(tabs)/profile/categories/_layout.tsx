import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import React, { useRef } from "react";
import { View } from "react-native";
import AddCategory from "~/components/profile/add-category";
import { useCategoryStore } from "~/stores/category";
import { Button as NativeButton, Platform } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function CategoriesLayout() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { category } = useCategoryStore();
  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Categorías",
            headerBackTitle: "Configuración",
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerSearchBarOptions: {
              placeholder: "Buscar ...",
              hideWhenScrolling: false,
              cancelButtonText: "Cancelar",
            },
            headerLargeTitleShadowVisible: false,
            headerLeft: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Atrás"
                  color="#27BE8B"
                  onPress={() => {
                    router.back();
                  }}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Text>Configuración</Text>
                </Button>
              );
            },
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
          name="details/[id]"
          options={{
            title: "Gastos",
            headerShadowVisible: false,
            headerLargeTitle: true,
            headerRight: () => {
              return (
                <NativeButton
                  title="Editar"
                  color="#41D29B"
                  onPress={() => {
                    bottomSheetRef.current?.expand();
                  }}
                />
              );
            },
          }}
        />
      </Stack>

      <AddCategory category={category} bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
