import BottomSheet from "@gorhom/bottom-sheet";
import { router, Stack } from "expo-router";
import React, { useRef } from "react";
import { Button as NativeButton, Platform, View } from "react-native";
import AddCategory from "~/components/profile/add-category";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function CategoriesLayout() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [id, setId] = React.useState<number | null>(null);

  return (
    <View className="flex-1">
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Categorías",
            headerLargeTitle: false,
            headerShadowVisible: false,
            headerLargeTitleShadowVisible: false,
            headerLeft: () => {
              return Platform.OS === "ios" ? (
                <NativeButton
                  title="Perfil"
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
                    setId(null);
                    bottomSheetRef.current?.expand();
                  }}
                />
              ) : (
                <Button
                  variant="link"
                  onPress={() => {
                    setId(null);
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
          options={({ route }) => {
            const { id }: { id: number } = route.params as { id: number };
            return {
              title: "Gasto",
              headerShadowVisible: false,
              headerLargeTitle: true,
              headerRight: () => {
                return (
                  <NativeButton
                    title="Editar"
                    color="#41D29B"
                    onPress={() => {
                      bottomSheetRef.current?.expand();
                      setId(id);
                    }}
                  />
                );
              },
            };
          }}
        />
      </Stack>
      <AddCategory id={id} bottomSheetRef={bottomSheetRef} />
    </View>
  );
}
